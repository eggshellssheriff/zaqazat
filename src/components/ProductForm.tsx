
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/context";
import { XCircle, Upload, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type ProductFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    image: string | null;
  };
};

export function ProductForm({ open, onOpenChange, initialData }: ProductFormProps) {
  const { addProduct, updateProduct } = useApp();
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price.toString() || "");
  const [quantity, setQuantity] = useState(initialData?.quantity.toString() || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [imageSource, setImageSource] = useState<"file" | "camera">("file");

  const isEditMode = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name,
      price: parseFloat(price) || 0,
      quantity: parseInt(quantity) || 0,
      description,
      image,
    };

    if (isEditMode && initialData) {
      updateProduct({ ...productData, id: initialData.id });
    } else {
      addProduct(productData);
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    if (!isEditMode) {
      setName("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setImage(null);
    }
    // Обязательно отключаем камеру при закрытии
    stopCamera();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    stopCamera();
  };

  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: "environment" // Используем заднюю камеру на мобильных устройствах
        } 
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Ошибка доступа к камере:", err);
      alert("Не удалось получить доступ к камере. Проверьте разрешения.");
    }
  };

  const stopCamera = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Устанавливаем размеры холста равными размерам видео
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Рисуем текущий кадр видео на холсте
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Преобразуем холст в data URL и устанавливаем его как изображение
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
      
      // Останавливаем камеру
      stopCamera();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) stopCamera(); // Останавливаем камеру при закрытии диалога
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Редактировать товар" : "Добавить новый товар"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название товара</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Введите название товара"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (тг)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Количество</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание товара"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Изображение</Label>
            
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Предпросмотр" 
                  className="w-full h-48 object-contain border rounded-md"
                />
                <Button 
                  type="button" 
                  variant="destructive"
                  size="icon"
                  onClick={removeImage} 
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="file" onValueChange={(value) => {
                setImageSource(value as "file" | "camera");
                if (value === "camera") {
                  startCamera();
                } else {
                  stopCamera();
                }
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">Галерея</TabsTrigger>
                  <TabsTrigger value="camera">Камера</TabsTrigger>
                </TabsList>
                
                <TabsContent value="file">
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-2 h-48 bg-muted/30">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Загрузите изображение
                    </p>
                    <Input
                      ref={fileInputRef}
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Выбрать файл
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="camera">
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center h-48 bg-muted/30 relative">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline
                      className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                    />
                    
                    {!cameraActive && (
                      <>
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Сделайте фото с камеры
                        </p>
                      </>
                    )}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cameraActive ? captureImage : startCamera}
                      className="mt-2"
                    >
                      {cameraActive ? "Сделать фото" : "Включить камеру"}
                    </Button>
                    
                    {/* Скрытый холст для захвата изображения */}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit">
              {isEditMode ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
