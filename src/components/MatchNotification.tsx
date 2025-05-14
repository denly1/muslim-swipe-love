
import { Heart, Send } from "lucide-react";
import { Profile } from "@/hooks/useProfiles";
import { toast } from "@/components/ui/use-toast";

type MatchNotificationProps = {
  matchedProfile: Profile;
  onClose: () => void;
  onStartChat: (username: string) => void;
};

const MatchNotification = ({ matchedProfile, onClose, onStartChat }: MatchNotificationProps) => {
  // Get the Telegram username from the profile (in a real app would come from database)
  // For now we'll use the default username if telegramUsername isn't available
  const telegramUsername = matchedProfile.telegramUsername || matchedProfile.name.toLowerCase();
  
  const handleStartChat = () => {
    onStartChat(telegramUsername);
  };
  
  const handleCopyProfile = () => {
    navigator.clipboard.writeText(`https://t.me/${telegramUsername}`);
    toast({
      title: "Ссылка скопирована",
      description: "Telegram профиль скопирован в буфер обмена",
    });
  };
  
  return (
    <div className="match-notification">
      <div className="w-full max-w-md p-6 bg-gradient-to-br from-muslim-green-50 to-muslim-green-100 dark:from-muslim-green-900 dark:to-muslim-green-800 rounded-2xl shadow-xl border border-muslim-green-200 dark:border-muslim-green-700 animate-scale-in">
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
              className="w-24 h-24 object-cover rounded-full border-4 border-muslim-green-200 dark:border-muslim-green-700" 
            />
          </div>
          
          <p className="mt-3 text-muslim-green-600 dark:text-muslim-green-300">
            Telegram: <span className="font-medium">@{telegramUsername}</span>
          </p>
          
          <div className="mt-6 flex flex-col space-y-3">
            <button 
              className="btn-muslim flex items-center justify-center gap-2"
              onClick={handleStartChat}
            >
              <Send size={18} /> Открыть чат
            </button>
            
            <button 
              className="btn-muslim-outline"
              onClick={handleCopyProfile}
            >
              Скопировать профиль
            </button>
            
            <button 
              className="text-muslim-green-600 dark:text-muslim-green-400 hover:underline mt-2"
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
