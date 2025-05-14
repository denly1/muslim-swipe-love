
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import LikeCounter from '@/components/LikeCounter';
import { useAuth } from '@/hooks/useAuth';
import { useProfiles } from '@/hooks/useProfiles';

const Premium = () => {
  const { isPremium, upgradeToPremiun } = useAuth();
  const { viewLikedByProfiles, canViewLikes } = useProfiles();
  
  // Handle premium purchase
  const handlePurchasePremium = () => {
    // In a real app, we'd integrate with YooMoney here
    // For demo purposes, we'll just set premium to true
    upgradeToPremiun();
  };
  
  // Handle opening chat with a user who liked you
  const handleOpenChat = (username: string) => {
    // In a real app, this would link to Telegram
    window.open(`https://t.me/${username}`, '_blank');
  };

  return (
    <Layout title="Премиум">
      <div className="py-4">
        {/* Premium status */}
        <div className="mb-6">
          {isPremium ? (
            <div className="bg-gradient-to-r from-muslim-gold-400 to-muslim-gold-600 text-muslim-green-800 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-1">У вас активирован Premium! 🎉</h2>
              <p>Наслаждайтесь всеми преимуществами премиум-аккаунта</p>
            </div>
          ) : (
            <div className="bg-muslim-green-50 dark:bg-muslim-green-800 p-4 rounded-lg border border-muslim-green-200 dark:border-muslim-green-700">
              <h2 className="text-xl font-bold text-muslim-green-800 dark:text-white mb-1">
                Получите Premium сегодня
              </h2>
              <p className="text-muslim-green-600 dark:text-muslim-green-300">
                Откройте все возможности для знакомств
              </p>
            </div>
          )}
        </div>
        
        {/* Like counter */}
        <LikeCounter showPremiumPrompt={false} />
        
        {/* Premium features */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-muslim-green-800 dark:text-white mb-3">
            Преимущества Premium
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-muslim-green-100 dark:bg-muslim-green-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check size={14} className="text-muslim-green-600 dark:text-muslim-green-400" />
              </div>
              <div>
                <p className="text-muslim-green-800 dark:text-white font-medium">100 лайков в день</p>
                <p className="text-sm text-muslim-green-600 dark:text-muslim-green-400">
                  Вместо 10 лайков для стандартного аккаунта
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-muslim-green-100 dark:bg-muslim-green-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check size={14} className="text-muslim-green-600 dark:text-muslim-green-400" />
              </div>
              <div>
                <p className="text-muslim-green-800 dark:text-white font-medium">Просмотр лайков</p>
                <p className="text-sm text-muslim-green-600 dark:text-muslim-green-400">
                  Видите, кто вас лайкнул, до взаимного совпадения
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-muslim-green-100 dark:bg-muslim-green-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <Check size={14} className="text-muslim-green-600 dark:text-muslim-green-400" />
              </div>
              <div>
                <p className="text-muslim-green-800 dark:text-white font-medium">Повышенная видимость</p>
                <p className="text-sm text-muslim-green-600 dark:text-muslim-green-400">
                  Ваш профиль будет показываться чаще
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium purchase */}
        {!isPremium && (
          <Card className="mb-6 border-muslim-green-200 dark:border-muslim-green-700">
            <CardHeader className="pb-3">
              <CardTitle>Купить Premium</CardTitle>
              <CardDescription>Всего 299 руб./месяц</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muslim-green-600 dark:text-muslim-green-400">
                Подписка продлевается автоматически. Вы можете отменить подписку в любой момент.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-muslim-gold-400 to-muslim-gold-600 hover:from-muslim-gold-500 hover:to-muslim-gold-700 text-muslim-green-800"
                onClick={handlePurchasePremium}
              >
                Купить Premium
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <Separator className="my-6" />
        
        {/* Who liked you section */}
        <h3 className="text-lg font-semibold text-muslim-green-800 dark:text-white mb-3">
          Кто вас лайкнул
        </h3>
        
        {!canViewLikes ? (
          <Card className="border-muslim-green-200 dark:border-muslim-green-700 mb-6">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="bg-muslim-green-100 dark:bg-muslim-green-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muslim-green-600 dark:text-muslim-green-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="text-muslim-green-800 dark:text-white font-medium mb-2">
                Функция доступна в Premium
              </h3>
              <p className="text-sm text-muslim-green-600 dark:text-muslim-green-400 mb-4">
                Купите Premium, чтобы видеть тех, кто вас лайкнул
              </p>
              <Button
                className="bg-gradient-to-r from-muslim-gold-400 to-muslim-gold-600 hover:from-muslim-gold-500 hover:to-muslim-gold-700 text-muslim-green-800"
                onClick={handlePurchasePremium}
              >
                Получить Premium
              </Button>
            </CardContent>
          </Card>
        ) : viewLikedByProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {viewLikedByProfiles.map((profile) => (
              <div 
                key={profile.id}
                className="bg-white dark:bg-muslim-green-800 rounded-lg shadow p-3 border border-muslim-green-100 dark:border-muslim-green-700 flex items-center gap-3"
              >
                <img 
                  src={profile.photos[0]} 
                  alt={profile.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-muslim-green-800 dark:text-white truncate">
                    {profile.name}, {profile.age}
                  </h4>
                  <p className="text-xs text-muslim-green-600 dark:text-muslim-green-400 truncate">
                    {profile.location?.city || "Неизвестно"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0"
                  onClick={() => handleOpenChat(profile.name.toLowerCase())}
                >
                  Открыть
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-muslim-green-800 rounded-lg shadow p-4 border border-muslim-green-100 dark:border-muslim-green-700 text-center mb-6">
            <p className="text-muslim-green-600 dark:text-muslim-green-300">
              Пока никто не лайкнул ваш профиль. Продолжайте поиск!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Premium;
