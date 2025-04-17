
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, UploadCloud, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  maxSize?: number; // in KB
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
  maxSize = 1024, // Default 1MB
  className = ""
}) => {
  const [preview, setPreview] = useState<string | null>(value);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Reset error when value changes
  useEffect(() => {
    setError(null);
  }, [value]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    setLoading(true);

    // Check file size
    if (file.size > maxSize * 1024) {
      setError(`Файл слишком большой (макс. ${maxSize}KB)`);
      setLoading(false);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    
    reader.onloadend = () => {
      // Optimize image by reducing its size
      const img = new Image();
      img.src = reader.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Limit max dimensions
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with reduced quality
        const optimizedImage = canvas.toDataURL('image/jpeg', 0.7);
        
        setPreview(optimizedImage);
        onChange(optimizedImage);
        setLoading(false);
      };
      
      img.onerror = () => {
        setError('Ошибка при обработке изображения');
        setLoading(false);
      };
    };
    
    reader.onerror = () => {
      setError('Ошибка при чтении файла');
      setLoading(false);
    };
    
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleClear = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div 
        className={cn(
          "border-2 border-dashed rounded-md flex items-center justify-center relative overflow-hidden",
          preview ? "border-transparent" : "border-muted-foreground/25",
          error ? "border-red-500" : "",
          className || "h-[200px]"
        )}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
            <p className="text-xs text-muted-foreground mt-2">Оптимизация...</p>
          </div>
        ) : preview ? (
          <div className="relative w-full h-full group">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 px-2">
            {error ? (
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-xs text-red-500">{error}</p>
              </div>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Перетащите сюда изображение<br />или нажмите для выбора
                </p>
              </>
            )}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      {!error && (
        <p className="text-xs text-muted-foreground text-center">
          Рекомендуемый размер: до {maxSize} KB
        </p>
      )}
    </div>
  );
};
