import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";

// Define a Profile type for our dating profiles
export type Profile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  distance?: number; // in km
  interests: string[];
  religiousLevel: "practicing" | "moderate" | "cultural";
  maritalStatus: "single" | "divorced" | "widowed";
  lookingFor: "marriage" | "friendship" | "both";
  telegramUsername?: string; // Added Telegram username field
};

export type UserProfile = Profile & {
  userId: string;
  email: string;
  premium: boolean;
  likesReceived: string[]; // IDs of users who liked this profile
};

type ProfileContextType = {
  profiles: Profile[];
  userProfile: UserProfile | null;
  likedProfiles: Set<string>;
  dislikedProfiles: Set<string>;
  matches: Profile[];
  currentProfile: Profile | null;
  loadingProfiles: boolean;
  loadingLocation: boolean;
  createUserProfile: (profile: Omit<UserProfile, "id" | "userId" | "premium" | "likesReceived" | "email">) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  likeProfile: (profileId: string) => void;
  dislikeProfile: (profileId: string) => void;
  nextProfile: () => void;
  canViewLikes: boolean;
  viewLikedByProfiles: Profile[];
  requestLocationPermission: () => Promise<boolean>;
};

// Mock profiles
const mockProfiles: Profile[] = [
  {
    id: "profile1",
    name: "Amina",
    age: 24,
    bio: "Люблю читать Коран, увлекаюсь кулинарией. Ищу порядочного спутника жизни.",
    photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80"],
    location: {
      latitude: 55.7558,
      longitude: 37.6173,
      city: "Moscow",
      country: "Russia"
    },
    interests: ["cooking", "reading", "religion"],
    religiousLevel: "practicing",
    maritalStatus: "single",
    lookingFor: "marriage",
    telegramUsername: "amina_muslim"
  },
  {
    id: "profile2",
    name: "Fatima",
    age: 27,
    bio: "Учительница начальных классов. Люблю детей и путешествия.",
    photos: ["https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80"],
    location: {
      latitude: 55.7,
      longitude: 37.6,
      city: "Moscow",
      country: "Russia"
    },
    interests: ["teaching", "traveling", "kids"],
    religiousLevel: "moderate",
    maritalStatus: "single",
    lookingFor: "marriage",
    telegramUsername: "fatima_teacher"
  },
  {
    id: "profile3",
    name: "Yasmin",
    age: 23,
    bio: "Студентка медицинского. Ценю семейные традиции и честность.",
    photos: ["https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"],
    location: {
      latitude: 55.8,
      longitude: 37.5,
      city: "Moscow",
      country: "Russia"
    },
    interests: ["medicine", "family", "honesty"],
    religiousLevel: "practicing",
    maritalStatus: "single",
    lookingFor: "marriage",
    telegramUsername: "yasmin_med"
  },
  {
    id: "profile4",
    name: "Leila",
    age: 29,
    bio: "Работаю в IT. Ищу человека с серьезными намерениями. Люблю активный образ жизни.",
    photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"],
    location: {
      latitude: 55.75,
      longitude: 37.61,
      city: "Moscow",
      country: "Russia"
    },
    interests: ["tech", "fitness", "travel"],
    religiousLevel: "moderate",
    maritalStatus: "divorced",
    lookingFor: "friendship",
    telegramUsername: "leila_it"
  },
  {
    id: "profile5",
    name: "Ibrahim",
    age: 28,
    bio: "Инженер-строитель. Люблю спорт и путешествовать. В поиске серьезных отношений.",
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"],
    location: {
      latitude: 55.76,
      longitude: 37.62,
      city: "Moscow",
      country: "Russia"
    },
    interests: ["engineering", "sports", "travel"],
    religiousLevel: "practicing",
    maritalStatus: "single",
    lookingFor: "marriage",
    telegramUsername: "ibrahim_engineer"
  }
];

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isPremium } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [dislikedProfiles, setDislikedProfiles] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // Store profiles that liked the user (viewable by premium users)
  const [likedByProfiles, setLikedByProfiles] = useState<Profile[]>([]);
  
  // Load profiles when the component mounts
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Load user profile and settings
  const loadInitialData = async () => {
    // For demo purposes, we'll load mock data
    setLoadingProfiles(true);
    
    try {
      // Load stored data from localStorage
      const storedLikes = localStorage.getItem(`muslim_dating_likes_${user?.id}`);
      const storedDislikes = localStorage.getItem(`muslim_dating_dislikes_${user?.id}`);
      const storedUserProfile = localStorage.getItem(`muslim_dating_profile_${user?.id}`);
      
      if (storedLikes) setLikedProfiles(new Set(JSON.parse(storedLikes)));
      if (storedDislikes) setDislikedProfiles(new Set(JSON.parse(storedDislikes)));
      if (storedUserProfile) setUserProfile(JSON.parse(storedUserProfile));
      
      // Wait a moment to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get actual location
      await requestLocationPermission();
      
      // Filter and sort profiles
      filterAndSortProfiles();
      
      // Generate some fake likes for the user (for premium feature)
      generateFakeLikes();
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast({
        variant: "destructive",
        title: "Error loading profiles",
        description: "Could not load profiles. Please try again later.",
      });
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Filter and sort profiles based on location, preferences, etc.
  const filterAndSortProfiles = () => {
    // Filter out liked and disliked profiles
    let filteredProfiles = [...mockProfiles].filter(profile => 
      !likedProfiles.has(profile.id) && !dislikedProfiles.has(profile.id)
    );
    
    // Sort by distance if we have user location
    if (userLocation) {
      filteredProfiles = filteredProfiles.map(profile => {
        if (profile.location) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            profile.location.latitude,
            profile.location.longitude
          );
          return { ...profile, distance };
        }
        return profile;
      }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }
    
    setProfiles(filteredProfiles);
    setCurrentProfile(filteredProfiles.length > 0 ? filteredProfiles[0] : null);
  };
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return Math.round(distance);
  };

  // For the premium feature - generate fake profiles that liked the user
  const generateFakeLikes = () => {
    // Randomly select 3 profiles that "liked" the user
    const selectedProfiles = [...mockProfiles]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setLikedByProfiles(selectedProfiles);
    
    // If we have a user profile, update its likesReceived
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        likesReceived: selectedProfiles.map(p => p.id)
      };
      setUserProfile(updatedProfile);
      localStorage.setItem(`muslim_dating_profile_${user?.id}`, JSON.stringify(updatedProfile));
    }
  };

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    setLoadingLocation(true);
    try {
      if (!navigator.geolocation) {
        toast({
          variant: "destructive",
          title: "Location not supported",
          description: "Your browser does not support geolocation.",
        });
        return false;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });
      
      // If we have a user profile, update its location
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          location: {
            ...userProfile.location,
            latitude,
            longitude
          }
        };
        setUserProfile(updatedProfile);
        localStorage.setItem(`muslim_dating_profile_${user?.id}`, JSON.stringify(updatedProfile));
      }
      
      // Re-filter profiles with the new location
      filterAndSortProfiles();
      return true;
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        variant: "destructive",
        title: "Location error",
        description: "Could not get your location. Some features will be limited.",
      });
      return false;
    } finally {
      setLoadingLocation(false);
    }
  };
  
  // Create a user profile
  const createUserProfile = (profile: Omit<UserProfile, "id" | "userId" | "premium" | "likesReceived" | "email">) => {
    if (!user) return;
    
    const newProfile: UserProfile = {
      id: `profile_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      email: user.email,
      premium: !!user.premium,
      likesReceived: [],
      ...profile
    };
    
    setUserProfile(newProfile);
    localStorage.setItem(`muslim_dating_profile_${user.id}`, JSON.stringify(newProfile));
    
    toast({
      title: "Profile created",
      description: "Your profile has been created successfully!",
    });
  };
  
  // Update user profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);
    localStorage.setItem(`muslim_dating_profile_${user.id}`, JSON.stringify(updatedProfile));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully!",
    });
  };
  
  // Like a profile
  const likeProfile = (profileId: string) => {
    if (!user) return;
    
    // Update liked profiles
    const newLikedProfiles = new Set(likedProfiles);
    newLikedProfiles.add(profileId);
    setLikedProfiles(newLikedProfiles);
    localStorage.setItem(`muslim_dating_likes_${user.id}`, JSON.stringify([...newLikedProfiles]));
    
    // Check for a match
    const likedProfile = profiles.find(p => p.id === profileId);
    if (likedProfile && likedByProfiles.some(p => p.id === profileId)) {
      // It's a match!
      setMatches(prev => [...prev, likedProfile]);
      toast({
        title: "It's a match! 💚",
        description: `You and ${likedProfile.name} liked each other!`,
      });
    }
    
    // Move to the next profile
    nextProfile();
  };
  
  // Dislike a profile
  const dislikeProfile = (profileId: string) => {
    if (!user) return;
    
    // Update disliked profiles
    const newDislikedProfiles = new Set(dislikedProfiles);
    newDislikedProfiles.add(profileId);
    setDislikedProfiles(newDislikedProfiles);
    localStorage.setItem(`muslim_dating_dislikes_${user.id}`, JSON.stringify([...newDislikedProfiles]));
    
    // Move to the next profile
    nextProfile();
  };
  
  // Move to the next profile
  const nextProfile = () => {
    if (profiles.length === 0) return;
    
    const currentIndex = profiles.findIndex(p => p.id === currentProfile?.id);
    if (currentIndex === -1 || currentIndex === profiles.length - 1) {
      // We're at the end, refresh the list
      filterAndSortProfiles();
    } else {
      setCurrentProfile(profiles[currentIndex + 1]);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        userProfile,
        likedProfiles,
        dislikedProfiles,
        matches,
        currentProfile,
        loadingProfiles,
        loadingLocation,
        createUserProfile,
        updateUserProfile,
        likeProfile,
        dislikeProfile,
        nextProfile,
        canViewLikes: !!user?.premium,
        viewLikedByProfiles: isPremium ? likedByProfiles : [],
        requestLocationPermission
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfiles must be used within a ProfileProvider");
  }
  return context;
};

export default useProfiles;
