
import { useToast, toast } from "@/hooks/use-toast";

// Configure compact notifications at the bottom center of the screen
const originalToast = toast;

// Create a wrapper over the original toast
const compactToast = (props: Parameters<typeof originalToast>[0]) => {
  return originalToast({
    ...props,
    // Add classes for styling
    className: `${props.className || ''} compact-toast swipeable-toast pointer-events-auto`,
    // Reduce display time
    duration: props.duration || 2000,
    // In the new version the position is not set directly
  });
};

export { useToast, compactToast as toast };
