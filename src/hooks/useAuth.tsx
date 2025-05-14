import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  telegramUsername?: string; // Added Telegram username field
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, telegramUsername: string, avatar?: File) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  getLikeLimit: () => number;
  hasReachedLikeLimit: () => boolean;
  incrementLikeCount: () => void;
  isPremium: boolean;
  upgradeToPremiun: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This wrapper adds safety around router hooks
const SafeAuthProvider = ({ children }: { children: ReactNode }) => {
  try {
    return <AuthProviderWithRouter>{children}</AuthProviderWithRouter>;
  } catch (error) {
    console.error("Router context not available:", error);
    // Fallback that doesn't use router hooks
    return <div>Loading authentication...</div>;
  }
};

// The actual provider that uses router hooks
const AuthProviderWithRouter = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
        // Generate a telegram username from the email for demo purposes
        telegramUsername: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + "_tg",
      };
      
      setUser(mockUser);
      localStorage.setItem("muslim_dating_user", JSON.stringify(mockUser));
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать в Halal Match!",
        className: "bg-telegram-blue text-white",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Проверьте ваши данные",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, telegramUsername: string, avatar?: File) => {
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
        telegramUsername,
      };
      
      if (avatar) {
        // In a real app, we would upload this to a storage service
        mockUser.avatar = URL.createObjectURL(avatar);
      }
      
      setUser(mockUser);
      localStorage.setItem("muslim_dating_user", JSON.stringify(mockUser));
      toast({
        title: "Регистрация выполнена",
        description: "Добро пожаловать в Halal Match!",
        className: "bg-telegram-blue text-white",
      });
      navigate("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Пожалуйста, попробуйте еще раз",
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
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы.",
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
        title: "Premium активировано!",
        description: "У вас теперь есть доступ ко всем премиум-функциям.",
        className: "bg-telegram-blue text-white",
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
        logout: () => {
          setUser(null);
          localStorage.removeItem("muslim_dating_user");
          navigate("/");
          toast({
            title: "Выход выполнен",
            description: "Вы успешно вышли из системы.",
          });
        },
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

// Export the safe provider
export const AuthProvider = SafeAuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
