
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Define types for our user and auth context
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  premium: boolean;
  likeCount: number;
  lastLikeDate: string | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, avatar?: File) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  getLikeLimit: () => number;
  hasReachedLikeLimit: () => boolean;
  incrementLikeCount: () => void;
  isPremium: boolean;
  upgradeToPremiun: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  
  // Check if we have a user in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("muslim_dating_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsPremium(parsedUser.premium);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("muslim_dating_user");
      }
    }
    setIsLoading(false);
  }, []);

  // In a real app, this would be done with a backend API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in a real app, we would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll create a mock user
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: email.split('@')[0],
        email,
        premium: false,
        likeCount: 0,
        lastLikeDate: null,
      };
      
      setUser(mockUser);
      localStorage.setItem("muslim_dating_user", JSON.stringify(mockUser));
      toast({
        title: "Login successful",
        description: "Welcome back to Halal Match!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, avatar?: File) => {
    setIsLoading(true);
    try {
      // Mock registration - in a real app, we would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll create a mock user
      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        premium: false,
        likeCount: 0,
        lastLikeDate: null,
      };
      
      if (avatar) {
        // In a real app, we would upload this to a storage service
        mockUser.avatar = URL.createObjectURL(avatar);
      }
      
      setUser(mockUser);
      localStorage.setItem("muslim_dating_user", JSON.stringify(mockUser));
      toast({
        title: "Registration successful",
        description: "Welcome to Halal Match!",
      });
      navigate("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("muslim_dating_user");
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem("muslim_dating_user", JSON.stringify(newUser));
      setIsPremium(newUser.premium);
    }
  };
  
  // Get the daily like limit based on premium status
  const getLikeLimit = () => {
    return user?.premium ? 100 : 10;
  };
  
  // Check if the user has reached their daily like limit
  const hasReachedLikeLimit = () => {
    if (!user) return true;
    
    const likeLimit = getLikeLimit();
    
    // If it's a new day, reset the count
    const today = new Date().toISOString().split('T')[0];
    const lastLikeDay = user.lastLikeDate ? user.lastLikeDate.split('T')[0] : null;
    
    if (lastLikeDay !== today) {
      return false; // New day, hasn't reached limit
    }
    
    return user.likeCount >= likeLimit;
  };
  
  // Increment the like count
  const incrementLikeCount = () => {
    if (user) {
      const today = new Date().toISOString();
      const lastLikeDay = user.lastLikeDate ? user.lastLikeDate.split('T')[0] : null;
      const todayDay = today.split('T')[0];
      
      // If it's a new day, reset the count
      const newCount = lastLikeDay !== todayDay ? 1 : user.likeCount + 1;
      
      updateUser({
        likeCount: newCount,
        lastLikeDate: today
      });
    }
  };

  // Upgrade user to premium
  const upgradeToPremiun = () => {
    if (user) {
      updateUser({ premium: true });
      toast({
        title: "Premium Activated!",
        description: "You now have access to all premium features.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        getLikeLimit,
        hasReachedLikeLimit,
        incrementLikeCount,
        isPremium,
        upgradeToPremiun,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
