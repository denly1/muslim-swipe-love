
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type LikeCounterProps = {
  showPremiumPrompt?: boolean;
};

const LikeCounter = ({ showPremiumPrompt = true }: LikeCounterProps) => {
  const { user, getLikeLimit, isPremium } = useAuth();
  
  if (!user) return null;
  
  const likeLimit = getLikeLimit();
  const likesUsed = user.likeCount || 0;
  const likesRemaining = Math.max(0, likeLimit - likesUsed);
  const percentUsed = (likesUsed / likeLimit) * 100;
  
  return (
    <div className="bg-white dark:bg-muslim-green-800 rounded-lg shadow-md p-3 mb-4 border border-muslim-green-100 dark:border-muslim-green-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Heart size={18} className="mr-2 text-muslim-green-600 dark:text-muslim-green-400" />
          <span className="font-medium text-muslim-green-800 dark:text-white">
            Лайки на сегодня
          </span>
        </div>
        <span className="text-muslim-green-600 dark:text-muslim-green-300 font-semibold">
          {likesRemaining} / {likeLimit}
        </span>
      </div>
      
      <Progress 
        value={percentUsed} 
        className="h-2 bg-muslim-green-100 dark:bg-muslim-green-700"
      />
      
      {showPremiumPrompt && !isPremium && likesUsed > 0 && (
        <p className="text-xs text-muslim-green-600 dark:text-muslim-green-400 mt-2">
          Нужно больше лайков? <span className="text-muslim-gold-500 font-semibold">Получите Premium</span> для 100 лайков в день!
        </p>
      )}
    </div>
  );
};

export default LikeCounter;
