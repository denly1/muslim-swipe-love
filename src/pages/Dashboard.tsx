
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProfileCard from '@/components/ProfileCard';
import LikeCounter from '@/components/LikeCounter';
import MatchNotification from '@/components/MatchNotification';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Filter, Heart } from 'lucide-react';
import { useProfiles, Profile } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentProfile, likeProfile, dislikeProfile, loadingProfiles, requestLocationPermission } = useProfiles();
  const { hasReachedLikeLimit } = useAuth();
  const [showMatch, setShowMatch] = useState<Profile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLike = (profileId: string) => {
    // Проверка, не исчерпан ли лимит лайков
    if (hasReachedLikeLimit()) {
      navigate('/premium');
      return;
    }
    
    const profile = currentProfile;
    likeProfile(profileId);
    
    // 30% шанс матча для демонстрационных целей
    if (profile && Math.random() < 0.3) {
      setTimeout(() => {
        setShowMatch(profile);
      }, 500);
    }
  };

  const handleDislike = (profileId: string) => {
    dislikeProfile(profileId);
  };
  
  const handleStartChat = (username: string) => {
    // Открываем Telegram чат с совпавшим профилем
    window.open(`https://t.me/${username}`, '_blank');
    setShowMatch(null);
    
    // Показываем уведомление
    toast({
      title: "Чат открыт",
      description: `Начните общение с @${username} в Telegram`,
    });
  };
  
  const handleRefreshLocation = async () => {
    setIsRefreshing(true);
    await requestLocationPermission();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Layout title="Знакомства">
      {/* Верхняя панель с кнопками */}
      <div className="flex justify-between items-center mb-4">
        {/* Счетчик лайков */}
        <LikeCounter />
        
        {/* Кнопка перехода к матчам */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/matches')}
          className="flex items-center gap-2 border-muslim-green-300 text-muslim-green-700 dark:border-muslim-green-500 dark:text-muslim-green-300"
        >
          <Heart className="h-4 w-4" />
          Матчи
        </Button>
      </div>
      
      {/* Кнопки действий */}
      <div className="mb-4 flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshLocation}
          disabled={isRefreshing}
          className="text-muslim-green-700 dark:text-muslim-green-300 shadow-sm hover:shadow-md transition-shadow"
        >
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Обновить местоположение
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/filters')}
          className="text-muslim-green-700 dark:text-muslim-green-300 shadow-sm hover:shadow-md transition-shadow"
        >
          <Filter className="mr-2 h-4 w-4" />
          Фильтры
        </Button>
      </div>
      
      {/* Профили */}
      <div className="relative flex-1">
        {loadingProfiles ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-muslim-green-600 dark:text-muslim-green-400" />
          </div>
        ) : currentProfile ? (
          <ProfileCard
            profile={currentProfile}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-center px-4">
            <div className="bg-muslim-green-100 dark:bg-muslim-green-800 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Search className="h-8 w-8 text-muslim-green-600 dark:text-muslim-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-muslim-green-800 dark:text-white mb-2">
              Анкеты не найдены
            </h3>
            <p className="text-muslim-green-600 dark:text-muslim-green-300 max-w-xs">
              Попробуйте изменить параметры поиска или вернитесь позже
            </p>
          </div>
        )}
      </div>
      
      {/* Уведомление о матче */}
      {showMatch && (
        <MatchNotification
          matchedProfile={showMatch}
          onClose={() => setShowMatch(null)}
          onStartChat={handleStartChat}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
