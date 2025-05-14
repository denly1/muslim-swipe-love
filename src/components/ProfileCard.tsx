
import { useState } from "react";
import { Check, X, MapPin } from "lucide-react";
import { Profile } from "@/hooks/useProfiles";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

type ProfileCardProps = {
  profile: Profile;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
};

const ProfileCard = ({ profile, onLike, onDislike }: ProfileCardProps) => {
  const { hasReachedLikeLimit, incrementLikeCount } = useAuth();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  
  const handleNextPhoto = () => {
    if (currentPhoto < profile.photos.length - 1) {
      setCurrentPhoto(currentPhoto + 1);
    } else {
      setCurrentPhoto(0);
    }
  };
  
  const handleLike = () => {
    if (hasReachedLikeLimit()) {
      toast({
        title: "Daily Like Limit Reached",
        description: "Upgrade to Premium for more likes per day!",
        variant: "destructive",
      });
      return;
    }
    
    setSwipeDirection("right");
    incrementLikeCount();
    
    // Delay the actual like action to allow animation to play
    setTimeout(() => {
      onLike(profile.id);
      setSwipeDirection(null);
    }, 500);
  };
  
  const handleDislike = () => {
    setSwipeDirection("left");
    
    // Delay the actual dislike action to allow animation to play
    setTimeout(() => {
      onDislike(profile.id);
      setSwipeDirection(null);
    }, 500);
  };

  return (
    <div 
      className={`profile-card ${swipeDirection === 'right' ? 'animate-swipe-right' : swipeDirection === 'left' ? 'animate-swipe-left' : ''}`}
      data-testid="profile-card"
    >
      {/* Photos */}
      <div 
        className="h-3/5 bg-cover bg-center" 
        style={{ backgroundImage: `url(${profile.photos[currentPhoto]})` }}
        onClick={handleNextPhoto}
      >
        {/* Photo indicator dots */}
        {profile.photos.length > 1 && (
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-1">
            {profile.photos.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${index === currentPhoto ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Profile info */}
      <div className="p-4 bg-card dark:bg-muslim-green-700">
        <h2 className="text-2xl font-bold text-muslim-green-800 dark:text-white">
          {profile.name}, {profile.age}
        </h2>
        
        {/* Location with distance */}
        {profile.distance && (
          <div className="flex items-center text-muslim-green-600 dark:text-muslim-green-300 text-sm mt-1 mb-2">
            <MapPin size={16} className="mr-1" />
            <span>
              {profile.distance} км {profile.location?.city && `· ${profile.location.city}`}
            </span>
          </div>
        )}
        
        {/* Religious level */}
        <div className="my-2">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-muslim-green-100 text-muslim-green-700 dark:bg-muslim-green-600 dark:text-white">
            {profile.religiousLevel === "practicing" ? "Практикующий" : 
             profile.religiousLevel === "moderate" ? "Умеренно практикующий" : 
             "Культурное соблюдение"}
          </span>
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-muslim-green-100 text-muslim-green-700 dark:bg-muslim-green-600 dark:text-white ml-2">
            {profile.maritalStatus === "single" ? "Не в браке" : 
             profile.maritalStatus === "divorced" ? "В разводе" : 
             "Вдовец/Вдова"}
          </span>
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-muslim-green-100 text-muslim-green-700 dark:bg-muslim-green-600 dark:text-white ml-2">
            {profile.lookingFor === "marriage" ? "Брак" : 
             profile.lookingFor === "friendship" ? "Дружба" : 
             "Общение"}
          </span>
        </div>
        
        {/* Bio */}
        <p className="text-muslim-green-700 dark:text-muslim-green-200 text-sm mt-2 line-clamp-3">
          {profile.bio}
        </p>
        
        {/* Interests */}
        <div className="mt-3 flex flex-wrap gap-1">
          {profile.interests.map((interest, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-muslim-green-50 dark:bg-muslim-green-800 text-muslim-green-600 dark:text-muslim-green-300 rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-10">
        <button 
          className="swipe-button bg-white dark:bg-muslim-green-800 text-red-500"
          onClick={handleDislike}
          aria-label="Dislike"
        >
          <X size={32} />
        </button>
        <button 
          className="swipe-button bg-white dark:bg-muslim-green-800 text-green-500"
          onClick={handleLike}
          aria-label="Like"
        >
          <Check size={32} />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
