
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MessageCircle, Copy } from 'lucide-react';
import Layout from '@/components/Layout';
import { useProfiles, Profile } from '@/hooks/useProfiles';
import { Card } from '@/components/ui/card';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Matches = () => {
  const { matches } = useProfiles();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Function to open chat in Telegram
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

  // Function to copy username to clipboard
  const handleCopyUsername = (username: string, id: string) => {
    if (!username) {
      toast({
        title: "Ошибка",
        description: "У этого профиля нет имени пользователя Telegram",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(`@${username}`);
    setCopiedId(id);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
    
    toast({
      title: "Скопировано",
      description: `Имя пользователя @${username} скопировано в буфер обмена`,
    });
  };

  return (
    <Layout title="Мои Матчи">
      <div className="py-6">
        {matches.length === 0 ? (
          <div className="text-center p-8 animate-telegram-fade-in">
            <div className="mx-auto bg-telegram-light w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-telegram-blue" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              У вас пока нет матчей
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
              Продолжайте ставить лайки профилям, и скоро у вас появятся взаимные симпатии!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <Card key={match.id} className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow rounded-2xl animate-telegram-fade-in">
                <AspectRatio ratio={16/9}>
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${match.photos[0]})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                  </div>
                </AspectRatio>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{match.name}, {match.age}</h3>
                      {match.location?.city && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{match.location.city}</p>
                      )}
                    </div>
                    <div className="bg-telegram-blue text-white text-xs px-2 py-1 rounded-full">
                      Взаимно
                    </div>
                  </div>
                  
                  {match.telegramUsername ? (
                    <div className="flex flex-col space-y-2 mt-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Telegram: <span className="font-semibold">@{match.telegramUsername}</span>
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-telegram-blue hover:bg-telegram-blue hover:opacity-90"
                          onClick={() => handleOpenChat(match.telegramUsername || '')}
                        >
                          <MessageCircle className="mr-1 h-4 w-4" />
                          Открыть чат
                        </Button>
                        <Button 
                          size="sm" 
                          variant={copiedId === match.id ? "default" : "outline"}
                          className={`flex-1 ${copiedId === match.id ? "bg-green-500 hover:bg-green-500 hover:opacity-90" : ""}`}
                          onClick={() => handleCopyUsername(match.telegramUsername || '', match.id)}
                        >
                          <Copy className="mr-1 h-4 w-4" />
                          {copiedId === match.id ? "Скопировано" : "Копировать @"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">
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
