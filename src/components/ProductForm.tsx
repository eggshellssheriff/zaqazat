
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/context";
import { ImageUpload } from "@/components/ImageUpload";
import { AlertTriangle, Loader2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string | null;
};

type ProductFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disableImageUpload?: boolean;
  initialData?: Product;
};

export function ProductForm({ 
  open, 
  onOpenChange, 
  initialData,
  disableImageUpload = false 
}: ProductFormProps) {
  const { addProduct, updateProduct } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() || "1");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState<string | null>(initialData?.image || null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = "Укажите название товара";
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = "Укажите корректную цену";
    }
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) < 0) {
      newErrors.quantity = "Укажите корректное количество";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    const productData = {
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description: description.trim(),
      image: image,
    };
    
    if (initialData) {
      updateProduct({ ...productData, id: initialData.id });
    } else {
      addProduct(productData);
    }
    
    setIsLoading(false);
    onOpenChange(false);
    resetForm();
  };
  
  const resetForm = () => {
    if (!initialData) {
      setName("");
      setPrice("");
      setQuantity("1");
      setDescription("");
      setImage(null);
    }
  };
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setQuantity(initialData.quantity.toString());
      setDescription(initialData.description);
      setImage(initialData.image);
    } else {
      resetForm();
    }
  }, [initialData, open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Редактировать товар" : "Добавить новый товар"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Название товара</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Введите название товара"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {errors.name}
              </p>
            )}
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
                onChange={e => setPrice(e.target.value)}
                placeholder="0"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {errors.price}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Количество</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="1"
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {errors.quantity}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Описание товара"
              rows={3}
            />
          </div>
          
          {!disableImageUpload && (
            <div className="space-y-2">
              <Label>Фото товара (необязательно)</Label>
              <ImageUpload
                value={image}
                onChange={setImage}
                maxSize={500}
                className="h-[150px]"
              />
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
