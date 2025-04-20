import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { Loader2, AlertCircle } from "lucide-react";
import { validatePhoneNumber } from "@/lib/utils";

type OrderFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxImageSize?: number; // KB
  initialData?: {
    id: string;
    customerName: string;
    date: string;
    status: string;
    phoneNumber?: string;
    description?: string;
    image?: string | null;
    products: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
  };
};

export function OrderForm({ open, onOpenChange, initialData, maxImageSize = 1000 }: OrderFormProps) {
  const { addOrder, updateOrder, products: availableProducts } = useApp();
  
  const [customerName, setCustomerName] = useState(initialData?.customerName || "");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState(initialData?.status || "в пути");
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  
  const [selectedProduct, setSelectedProduct] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isEditMode = !!initialData;
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerName.trim()) newErrors.customerName = "Укажите имя заказчика";
    if (!date) newErrors.date = "Укажите дату заказа";
    if (!status) newErrors.status = "Укажите статус заказа";
    if (!productName) newErrors.productName = "Укажите название товара";
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = "Укажите корректную цену";
    }
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      newErrors.quantity = "Укажите корректное количество";
    }
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Некорректный номер телефона";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const totalAmount = parseInt(quantity) * parseFloat(price);
    
    const orderData = {
      customerName,
      date,
      status,
      phoneNumber: phoneNumber || undefined,
      description: description || undefined,
      image,
      products: [
        {
          productId: selectedProduct || `custom-${Date.now()}`,
          name: productName,
          quantity: parseInt(quantity),
          price: parseFloat(price),
        }
      ],
      totalAmount,
    };
    
    if (isEditMode && initialData) {
      updateOrder({ ...orderData, id: initialData.id });
    } else {
      addOrder(orderData);
    }
    
    setIsLoading(false);
    onOpenChange(false);
    resetForm();
  };
  
  const resetForm = () => {
    if (!isEditMode) {
      setCustomerName("");
      setDate(new Date().toISOString().split("T")[0]);
      setStatus("в пути");
      setPhoneNumber("");
      setDescription("");
      setImage(null);
      setProductName("");
      setPrice("");
      setQuantity("1");
      setSelectedProduct("");
    }
  };
  
  useEffect(() => {
    if (selectedProduct) {
      const product = availableProducts.find(p => p.id === selectedProduct);
      if (product) {
        setProductName(product.name);
        setPrice(product.price.toString());
      }
    }
  }, [selectedProduct, availableProducts]);
  
  useEffect(() => {
    if (isEditMode && initialData) {
      if (initialData.products.length > 0) {
        const firstProduct = initialData.products[0];
        setProductName(firstProduct.name);
        setPrice(firstProduct.price.toString());
        setQuantity(firstProduct.quantity.toString());
        
        const matchedProduct = availableProducts.find(p => p.id === firstProduct.productId);
        if (matchedProduct) {
          setSelectedProduct(firstProduct.productId);
        } else {
          setSelectedProduct("");
        }
      }
    }
  }, [initialData, isEditMode, availableProducts]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Редактировать заказ" : "Создать новый заказ"}
          </DialogTitle>
          <DialogDescription>
            Введите информацию о заказе
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="productName">Товар</Label>
              {availableProducts.length > 0 && (
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Выбрать товар" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Свой товар</SelectItem>
                    {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Название товара"
              className={errors.productName ? "border-red-500" : ""}
              disabled={!!selectedProduct && selectedProduct !== "custom"}
            />
            {errors.productName && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.productName}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (тг)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className={errors.price ? "border-red-500" : ""}
                disabled={!!selectedProduct && selectedProduct !== "custom"}
              />
              {errors.price && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.price}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Количество</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.quantity}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerName">Имя заказчика</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Имя клиента"
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.customerName}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Номер телефона (необязательно)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+7 (XXX) XXX-XX-XX"
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.phoneNumber}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.date}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="в пути">В пути</SelectItem>
                  <SelectItem value="на складе">На складе</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.status}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Дополнительная информация о заказе"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Фото (необязательно)</Label>
            <ImageUpload 
              value={image} 
              onChange={setImage} 
              maxSize={maxImageSize} // KB
              className="h-[120px]"
              enableCrop={false}
            />
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
