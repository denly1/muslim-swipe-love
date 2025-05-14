
import { Heart } from "lucide-react";
import { Profile } from "@/hooks/useProfiles";

type MatchNotificationProps = {
  matchedProfile: Profile;
  onClose: () => void;
  onStartChat: (username: string) => void;
};

const MatchNotification = ({ matchedProfile, onClose, onStartChat }: MatchNotificationProps) => {
  const handleStartChat = () => {
    // In a real app, this would use the actual username
    const username = matchedProfile.name.toLowerCase();
    onStartChat(username);
  };
  
  return (
    <div className="match-notification">
      <div className="w-full max-w-md p-6 bg-muslim-green-50 dark:bg-muslim-green-900 rounded-2xl shadow-xl border border-muslim-green-200 dark:border-muslim-green-700 animate-scale-in">
        <div className="text-center">
          <div className="flex justify-center">
            <Heart size={64} className="text-muslim-green-600 dark:text-muslim-green-400 animate-match-pulse" />
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-muslim-green-800 dark:text-white">
            Это совпадение!
          </h2>
          
          <p className="mt-2 text-muslim-green-600 dark:text-muslim-green-300">
            Вы и {matchedProfile.name} понравились друг другу!
          </p>
          
          <div className="mt-6 flex items-center justify-center space-x-4">
            <img 
              src={matchedProfile.photos[0]} 
              alt={matchedProfile.name}
              className="w-20 h-20 object-cover rounded-full border-4 border-muslim-green-200 dark:border-muslim-green-700" 
            />
          </div>
          
          <div className="mt-6 flex flex-col space-y-3">
            <button 
              className="btn-muslim flex items-center justify-center"
              onClick={handleStartChat}
            >
              Открыть чат
            </button>
            
            <button 
              className="btn-muslim-outline"
              onClick={onClose}
            >
              Продолжить поиск
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchNotification;
