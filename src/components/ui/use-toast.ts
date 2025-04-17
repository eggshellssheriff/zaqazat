
import { useToast, toast } from "@/hooks/use-toast";

// Настройка компактных уведомлений снизу экрана
const originalToast = toast;

// Создаем обертку над оригинальным toast
const compactToast = (props: Parameters<typeof originalToast>[0]) => {
  return originalToast({
    ...props,
    // Добавляем классы для стилизации
    className: `${props.className || ''} compact-toast swipeable-toast`,
    // Уменьшаем время отображения
    duration: props.duration || 2000,
    // Устанавливаем позицию снизу
    position: "bottom",
  });
};

export { useToast, compactToast as toast };
