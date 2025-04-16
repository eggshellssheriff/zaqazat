
import { useToast, toast } from "@/hooks/use-toast";

// Настройка свайпабельных уведомлений
const originalToast = toast;

// Создаем обертку над оригинальным toast
const swipeableToast = (props: Parameters<typeof originalToast>[0]) => {
  return originalToast({
    ...props,
    // Добавляем возможность закрывать уведомление свайпом
    className: `${props.className || ''} swipeable-toast`,
  });
};

export { useToast, swipeableToast as toast };
