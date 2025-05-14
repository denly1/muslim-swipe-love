
import { useState, useRef, useEffect } from "react";
import { Check, X, MapPin, MessageCircle } from "lucide-react";
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
  
  // Refs для свайпов
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const offsetXRef = useRef(0);
  const isDraggingRef = useRef(false);
  
  const handleNextPhoto = (event: React.MouseEvent) => {
    // Если выполняется свайп, не переключаем фото
    if (isDraggingRef.current) return;
    
    // Определяем, в какую сторону кликнули
    if (event.currentTarget instanceof HTMLElement) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      
      // Если клик был в левой части фото - переходим к предыдущему, иначе - к следующему
      if (x < rect.width / 2) {
        if (currentPhoto > 0) {
          setCurrentPhoto(currentPhoto - 1);
        } else {
          setCurrentPhoto(profile.photos.length - 1);
        }
      } else {
        if (currentPhoto < profile.photos.length - 1) {
          setCurrentPhoto(currentPhoto + 1);
        } else {
          setCurrentPhoto(0);
        }
      }
    }
  };
  
  const handleLike = () => {
    if (hasReachedLikeLimit()) {
      toast({
        title: "Лимит лайков исчерпан",
        description: "Перейдите на Premium для неограниченного количества лайков!",
        variant: "destructive",
      });
      return;
    }
    
    setSwipeDirection("right");
    incrementLikeCount();
    
    // Задержка для анимации
    setTimeout(() => {
      onLike(profile.id);
      setSwipeDirection(null);
    }, 500);
  };
  
  const handleDislike = () => {
    setSwipeDirection("left");
    
    // Задержка для анимации
    setTimeout(() => {
      onDislike(profile.id);
      setSwipeDirection(null);
    }, 500);
  };

  // Обработчики для свайпов
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true;
    
    if ('touches' in e) {
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
    } else {
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
    }
    
    offsetXRef.current = 0;
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Вычисляем смещение по X
    offsetXRef.current = currentX - startXRef.current;
    
    // Вычисляем смещение по Y (для определения вертикальной прокрутки)
    const offsetY = currentY - startYRef.current;
    
    // Если движение больше вертикальное, чем горизонтальное, прекращаем обработку свайпа
    if (Math.abs(offsetY) > Math.abs(offsetXRef.current) * 2) {
      return;
    }
    
    // Предотвращаем прокрутку страницы при свайпе
    e.preventDefault();
    
    if (cardRef.current) {
      // Применяем трансформацию с ограниченным смещением
      const maxOffset = 150;
      const limitedOffset = Math.max(Math.min(offsetXRef.current, maxOffset), -maxOffset);
      const rotate = limitedOffset * 0.05; // Угол поворота в зависимости от смещения
      
      cardRef.current.style.transform = `translateX(${limitedOffset}px) rotate(${rotate}deg)`;
      
      // Изменяем непрозрачность кнопок в зависимости от направления свайпа
      const likeOpacity = offsetXRef.current > 0 ? Math.min(offsetXRef.current / 100, 1) : 0;
      const dislikeOpacity = offsetXRef.current < 0 ? Math.min(-offsetXRef.current / 100, 1) : 0;
      
      // Находим кнопки по классу
      const likeButton = cardRef.current.querySelector('.like-indicator');
      const dislikeButton = cardRef.current.querySelector('.dislike-indicator');
      
      if (likeButton instanceof HTMLElement) {
        likeButton.style.opacity = String(likeOpacity);
      }
      
      if (dislikeButton instanceof HTMLElement) {
        dislikeButton.style.opacity = String(dislikeOpacity);
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease';
      
      // Находим индикаторы
      const likeButton = cardRef.current.querySelector('.like-indicator');
      const dislikeButton = cardRef.current.querySelector('.dislike-indicator');
      
      if (likeButton instanceof HTMLElement) {
        likeButton.style.opacity = '0';
      }
      
      if (dislikeButton instanceof HTMLElement) {
        dislikeButton.style.opacity = '0';
      }
      
      // Если смещение достаточно большое, выполняем соответствующее действие
      if (offsetXRef.current > 100) {
        // Свайп вправо - лайк
        handleLike();
      } else if (offsetXRef.current < -100) {
        // Свайп влево - дизлайк
        handleDislike();
      } else {
        // Возвращаем карточку в исходное положение
        cardRef.current.style.transform = 'translateX(0) rotate(0)';
      }
    }
  };
  
  // Слушатели событий для свайпов на мобильных
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      handleTouchMove(e as any);
    };
    
    const handleMouseUp = () => {
      handleTouchEnd();
    };
    
    // Обработка событий перетаскивания мышью
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Обрабатываем Telegram username если доступен
  const telegramUsername = profile.telegramUsername || null;

  return (
    <div 
      ref={cardRef}
      className={`profile-card ${swipeDirection === 'right' ? 'animate-swipe-right' : swipeDirection === 'left' ? 'animate-swipe-left' : ''}`}
      data-testid="profile-card"
      onMouseDown={handleTouchStart}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Индикаторы свайпов */}
      <div className="like-indicator absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-4 rounded-full opacity-0 z-10 shadow-lg">
        <Check size={32} />
      </div>
      <div className="dislike-indicator absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-4 rounded-full opacity-0 z-10 shadow-lg">
        <X size={32} />
      </div>
      
      {/* Фото с градиентным overlay для лучшей читаемости текста */}
      <div 
        className="h-3/5 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${profile.photos[currentPhoto]})` }}
        onClick={handleNextPhoto}
      >
        {/* Photo gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
        
        {/* Индикаторы фото */}
        {profile.photos.length > 1 && (
          <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 z-10">
            {profile.photos.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${index === currentPhoto ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Информация о профиле */}
      <div className="p-5 bg-card dark:bg-muslim-green-700 rounded-b-2xl shadow-inner">
        <h2 className="text-2xl font-bold text-muslim-green-800 dark:text-white flex items-center">
          {profile.name}, {profile.age}
          {telegramUsername && (
            <span className="ml-2 text-sm bg-muslim-gold-100 dark:bg-muslim-gold-800 text-muslim-gold-700 dark:text-muslim-gold-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <MessageCircle size={12} />
              @{telegramUsername}
            </span>
          )}
        </h2>
        
        {/* Местоположение с расстоянием */}
        {profile.distance && (
          <div className="flex items-center text-muslim-green-600 dark:text-muslim-green-300 text-sm mt-1 mb-3">
            <MapPin size={16} className="mr-1" />
            <span>
              {profile.distance} км {profile.location?.city && `· ${profile.location.city}`}
            </span>
          </div>
        )}
        
        {/* Уровень религиозности */}
        <div className="my-3">
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
        
        {/* Bio с улучшенным стилем */}
        <div className="bg-muslim-green-50/50 dark:bg-muslim-green-800/50 p-3 rounded-lg mt-3 mb-3">
          <p className="text-muslim-green-700 dark:text-muslim-green-200 text-sm italic">
            "{profile.bio}"
          </p>
        </div>
        
        {/* Интересы */}
        <div className="mt-3 flex flex-wrap gap-1">
          {profile.interests.map((interest, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-muslim-green-50 dark:bg-muslim-green-800 text-muslim-green-600 dark:text-muslim-green-300 rounded-full border border-muslim-green-100 dark:border-muslim-green-700"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-10">
        <button 
          className="swipe-button bg-white dark:bg-muslim-green-800 text-red-500 hover:bg-red-50 dark:hover:bg-muslim-green-700 transition-all"
          onClick={handleDislike}
          aria-label="Dislike"
        >
          <X size={32} />
        </button>
        <button 
          className="swipe-button bg-white dark:bg-muslim-green-800 text-green-500 hover:bg-green-50 dark:hover:bg-muslim-green-700 transition-all"
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
