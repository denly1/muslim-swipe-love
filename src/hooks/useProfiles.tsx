import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { toast } from "@/components/ui/use-toast";

// Define Profile type for our dating profiles
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
  telegramUsername?: string; // Telegram username field - only shown on match
};

export type UserProfile = Profile & {
  userId: string;
  email: string;
  premium: boolean;
  likesReceived: string[]; // ID пользователей, которые поставили лайк этому профилю
};

// Тип для фильтров поиска
export type FilterSettings = {
  minAge: number;
  maxAge: number;
  distance: number;
  religiousLevel?: ("practicing" | "moderate" | "cultural")[];
  maritalStatus?: ("single" | "divorced" | "widowed")[];
  lookingFor?: "marriage" | "friendship" | "both";
  hasTelegram?: boolean;
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
  filterSettings: FilterSettings;
  createUserProfile: (profile: Omit<UserProfile, "id" | "userId" | "premium" | "likesReceived" | "email">) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  likeProfile: (profileId: string) => void;
  dislikeProfile: (profileId: string) => void;
  nextProfile: () => void;
  canViewLikes: boolean;
  viewLikedByProfiles: Profile[];
  requestLocationPermission: () => Promise<boolean>;
  updateFilterSettings: (settings: Partial<FilterSettings>) => void;
};

// Моковые профили
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
  
  // Настройки фильтров поиска
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    minAge: 18,
    maxAge: 50,
    distance: 50,
    religiousLevel: ['practicing', 'moderate', 'cultural'],
    maritalStatus: ['single', 'divorced', 'widowed'],
    lookingFor: 'both',
    hasTelegram: false,
  });
  
  // Храним профили, которые поставили лайк пользователю (доступно премиум-пользователям)
  const [likedByProfiles, setLikedByProfiles] = useState<Profile[]>([]);
  
  // Load profiles when component mounts
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Загружаем профиль пользователя и настройки
  const loadInitialData = async () => {
    // В демо-целях загрузим моковые данные
    setLoadingProfiles(true);
    
    try {
      // Загружаем сохраненные данные из localStorage
      const storedLikes = localStorage.getItem(`muslim_dating_likes_${user?.id}`);
      const storedDislikes = localStorage.getItem(`muslim_dating_dislikes_${user?.id}`);
      const storedUserProfile = localStorage.getItem(`muslim_dating_profile_${user?.id}`);
      const storedFilterSettings = localStorage.getItem(`muslim_dating_filters_${user?.id}`);
      const storedMatches = localStorage.getItem(`muslim_dating_matches_${user?.id}`);
      
      if (storedLikes) setLikedProfiles(new Set(JSON.parse(storedLikes)));
      if (storedDislikes) setDislikedProfiles(new Set(JSON.parse(storedDislikes)));
      if (storedUserProfile) setUserProfile(JSON.parse(storedUserProfile));
      if (storedFilterSettings) setFilterSettings(JSON.parse(storedFilterSettings));
      if (storedMatches) setMatches(JSON.parse(storedMatches));
      
      // Ждем немного, чтобы имитировать API-вызов
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Получаем актуальное местоположение
      await requestLocationPermission();
      
      // Фильтруем и сортируем профили
      filterAndSortProfiles();
      
      // Генерируем фейковые лайки для пользователя (для премиум-функции)
      generateFakeLikes();
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки профилей",
        description: "Не удалось загрузить профили. Пожалуйста, попробуйте позже.",
      });
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Фильтруем и сортируем профили на основе местоположения, предпочтений и т.д.
  const filterAndSortProfiles = () => {
    // Фильтруем лайкнутые и дизлайкнутые профили
    let filteredProfiles = [...mockProfiles].filter(profile => 
      !likedProfiles.has(profile.id) && !dislikedProfiles.has(profile.id)
    );
    
    // Применяем фильтры поиска
    filteredProfiles = filteredProfiles.filter(profile => {
      // Фильтрация по возрасту
      if (profile.age < filterSettings.minAge || profile.age > filterSettings.maxAge) {
        return false;
      }
      
      // Фильтрация по уровню религиозности
      if (filterSettings.religiousLevel && 
          !filterSettings.religiousLevel.includes(profile.religiousLevel)) {
        return false;
      }
      
      // Фильтрация по семейному положению
      if (filterSettings.maritalStatus && 
          !filterSettings.maritalStatus.includes(profile.maritalStatus)) {
        return false;
      }
      
      // Фильтрация по цели знакомства
      if (filterSettings.lookingFor && 
          filterSettings.lookingFor !== 'both' && 
          profile.lookingFor !== filterSettings.lookingFor &&
          profile.lookingFor !== 'both') {
        return false;
      }
      
      // Фильтрация по наличию Telegram
      if (filterSettings.hasTelegram && !profile.telegramUsername) {
        return false;
      }
      
      return true;
    });
    
    // Сортируем по расстоянию, если у нас есть местоположение пользователя
    if (userLocation) {
      filteredProfiles = filteredProfiles.map(profile => {
        if (profile.location) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            profile.location.latitude,
            profile.location.longitude
          );
          
          // Применяем фильтр по расстоянию
          if (distance > filterSettings.distance) {
            return null; // Исключаем профили, которые слишком далеко
          }
          
          return { ...profile, distance };
        }
        return profile;
      })
      .filter(Boolean) // Удаляем null записи
      .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }
    
    setProfiles(filteredProfiles as Profile[]);
    setCurrentProfile(filteredProfiles.length > 0 ? filteredProfiles[0] as Profile : null);
  };
  
  // Рассчитываем расстояние между двумя точками по формуле Haversine
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

  // Для премиум-функции - генерируем фейковые профили, которые лайкнули пользователя
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

  // Запрашиваем разрешение на местоположение
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
  
  // Создаем профиль пользователя
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
  
  // Обновляем профиль пользователя
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
    
    // Update liked profiles list
    const newLikedProfiles = new Set(likedProfiles);
    newLikedProfiles.add(profileId);
    setLikedProfiles(newLikedProfiles);
    localStorage.setItem(`muslim_dating_likes_${user.id}`, JSON.stringify([...newLikedProfiles]));
    
    // Check for match
    const likedProfile = profiles.find(p => p.id === profileId);
    if (likedProfile && likedByProfiles.some(p => p.id === profileId)) {
      // It's a match!
      const updatedMatches = [...matches, likedProfile];
      setMatches(updatedMatches);
      localStorage.setItem(`muslim_dating_matches_${user.id}`, JSON.stringify(updatedMatches));
      
      toast({
        title: "Это матч! 💚",
        description: `Вы и ${likedProfile.name} понравились друг другу!`,
        className: "bg-telegram-blue text-white",
      });
    }
    
    // Move to next profile
    nextProfile();
  };
  
  // Ставим дизлайк профилю
  const dislikeProfile = (profileId: string) => {
    if (!user) return;
    
    // Обновляем список дизлайкнутых профилей
    const newDislikedProfiles = new Set(dislikedProfiles);
    newDislikedProfiles.add(profileId);
    setDislikedProfiles(newDislikedProfiles);
    localStorage.setItem(`muslim_dating_dislikes_${user.id}`, JSON.stringify([...newDislikedProfiles]));
    
    // Переходим к следующему профилю
    nextProfile();
  };
  
  // Переходим к следующему профилю
  const nextProfile = () => {
    if (profiles.length === 0) return;
    
    const currentIndex = profiles.findIndex(p => p.id === currentProfile?.id);
    if (currentIndex === -1 || currentIndex === profiles.length - 1) {
      // Мы в конце списка, обновляем его
      filterAndSortProfiles();
    } else {
      setCurrentProfile(profiles[currentIndex + 1]);
    }
  };
  
  // Обновляем настройки фильтров
  const updateFilterSettings = (settings: Partial<FilterSettings>) => {
    if (!user) return;
    
    const newSettings = { ...filterSettings, ...settings };
    setFilterSettings(newSettings);
    localStorage.setItem(`muslim_dating_filters_${user.id}`, JSON.stringify(newSettings));
    
    // Перезагружаем профили с новыми фильтрами
    filterAndSortProfiles();
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        userProfile,
        likedProfiles,
        dislikedProfiles,
        matches, // Telegram usernames will only be visible in matches
        currentProfile,
        loadingProfiles,
        loadingLocation,
        filterSettings,
        createUserProfile,
        updateUserProfile,
        likeProfile,
        dislikeProfile,
        nextProfile,
        canViewLikes: !!user?.premium,
        viewLikedByProfiles: isPremium ? likedByProfiles : [],
        requestLocationPermission,
        updateFilterSettings
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
