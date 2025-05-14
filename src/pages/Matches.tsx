
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useProfiles, Profile } from '@/hooks/useProfiles';
import { Card } from '@/components/ui/card';

const Matches = () => {
  const { matches } = useProfiles();

  // Функция для открытия чата в Telegram
  const handleOpenChat = (username: string) => {
    if (!username) {
      toast({
        title: "Ошибка",
        description: "У этого профиля нет имени пользователя Telegram",
        variant: "destructive",
      });
      return;
    }
    
    window.open(`https://t.me/${username}`, '_blank');
    
    toast({
      title: "Чат открыт",
      description: `Начните общение с @${username} в Telegram`,
    });
  };

  // Функция для копирования имени пользователя в буфер обмена
  const handleCopyUsername = (username: string) => {
    if (!username) {
      toast({
        title: "Ошибка",
        description: "У этого профиля нет имени пользователя Telegram",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(`@${username}`);
    
    toast({
      title: "Скопировано",
      description: `Имя пользователя @${username} скопировано в буфер обмена`,
    });
  };

  return (
    <Layout title="Мои Матчи">
      <div className="py-6">
        {matches.length === 0 ? (
          <div className="text-center p-8">
            <div className="mx-auto bg-muslim-green-100 dark:bg-muslim-green-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-muslim-green-600 dark:text-muslim-green-300" />
            </div>
            <h3 className="text-xl font-semibold text-muslim-green-800 dark:text-white mb-2">
              У вас пока нет матчей
            </h3>
            <p className="text-muslim-green-600 dark:text-muslim-green-300 max-w-xs mx-auto">
              Продолжайте ставить лайки профилям, и скоро у вас появятся взаимные симпатии!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <Card key={match.id} className="overflow-hidden border-muslim-green-200 dark:border-muslim-green-700 hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${match.photos[0]})` }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-lg font-semibold">{match.name}, {match.age}</h3>
                    {match.location?.city && (
                      <p className="text-xs text-white/80">{match.location.city}</p>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  {match.telegramUsername ? (
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muslim-green-700 dark:text-muslim-green-300 mb-2">
                        Telegram: <span className="font-semibold">@{match.telegramUsername}</span>
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleOpenChat(match.telegramUsername || '')}
                        >
                          <MessageCircle className="mr-1 h-4 w-4" />
                          Открыть чат
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleCopyUsername(match.telegramUsername || '')}
                        >
                          Копировать @
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muslim-green-600 dark:text-muslim-green-400 italic">
                      У этого профиля нет Telegram
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Matches;
