
import { useToast, toast } from "@/hooks/use-toast";

// Re-export the toast hooks with Telegram Mini App styling
export { useToast, toast };

// Add specialized toast functions for Telegram Mini App style notifications
export const telegramToast = {
  success: (message: string) => {
    toast({
      title: "Успешно",
      description: message,
      className: "bg-telegram-blue text-white border-telegram-blue",
    });
  },
  error: (message: string) => {
    toast({
      title: "Ошибка",
      description: message,
      variant: "destructive",
      className: "border-red-500",
    });
  },
  info: (message: string) => {
    toast({
      description: message,
      className: "bg-telegram-light border-telegram-blue text-telegram-dark",
    });
  }
};
