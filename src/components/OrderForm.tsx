
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

type OrderFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id: string;
    customerName: string;
    date: string;
    status: string;
    products: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
  };
};

export function OrderForm({ open, onOpenChange, initialData }: OrderFormProps) {
  const { addOrder, updateOrder, products } = useApp();
  const [customerName, setCustomerName] = useState(initialData?.customerName || "");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState(initialData?.status || "Новый");
  const [orderProducts, setOrderProducts] = useState<
    Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }>
  >(initialData?.products || []);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("1");

  const isEditMode = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAmount = orderProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    
    const orderData = {
      customerName,
      date,
      status,
      products: orderProducts,
      totalAmount,
    };

    if (isEditMode && initialData) {
      updateOrder({ ...orderData, id: initialData.id });
    } else {
      addOrder(orderData);
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    if (!isEditMode) {
      setCustomerName("");
      setDate(new Date().toISOString().split("T")[0]);
      setStatus("Новый");
      setOrderProducts([]);
    }
  };

  const addExistingProductToOrder = () => {
    // Фильтруем продукты, которые уже есть в заказе
    const availableProducts = products.filter(
      (p) => !orderProducts.some((op) => op.productId === p.id)
    );
    
    if (availableProducts.length === 0) return;
    
    const productToAdd = availableProducts[0];
    
    setOrderProducts([
      ...orderProducts,
      {
        productId: productToAdd.id,
        name: productToAdd.name,
        quantity: 1,
        price: productToAdd.price,
      },
    ]);
  };

  const addCustomProductToOrder = () => {
    if (!newProductName || !newProductPrice) return;
    
    const customPrice = parseFloat(newProductPrice);
    const customQuantity = parseInt(newProductQuantity) || 1;
    
    if (isNaN(customPrice) || customPrice <= 0) return;
    
    // Генерируем уникальный ID для пользовательского товара
    const customId = `custom-${Date.now()}`;
    
    setOrderProducts([
      ...orderProducts,
      {
        productId: customId,
        name: newProductName,
        quantity: customQuantity,
        price: customPrice,
      },
    ]);
    
    // Сбрасываем форму добавления пользовательского товара
    setNewProductName("");
    setNewProductPrice("");
    setNewProductQuantity("1");
  };

  const removeProductFromOrder = (index: number) => {
    setOrderProducts(orderProducts.filter((_, i) => i !== index));
  };

  const updateOrderProduct = (index: number, field: string, value: string | number) => {
    setOrderProducts(
      orderProducts.map((product, i) => {
        if (i === index) {
          return { ...product, [field]: value };
        }
        return product;
      })
    );
  };

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProduct = products.find((p) => p.id === productId);
    
    if (selectedProduct) {
      setOrderProducts(
        orderProducts.map((product, i) => {
          if (i === index) {
            return {
              productId: selectedProduct.id,
              name: selectedProduct.name,
              quantity: product.quantity,
              price: selectedProduct.price,
            };
          }
          return product;
        })
      );
    }
  };

  const totalAmount = orderProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Редактировать заказ" : "Создать новый заказ"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Имя клиента</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              placeholder="Введите имя клиента"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Новый">Новый</SelectItem>
                  <SelectItem value="В обработке">В обработке</SelectItem>
                  <SelectItem value="Отправлен">Отправлен</SelectItem>
                  <SelectItem value="Доставлен">Доставлен</SelectItem>
                  <SelectItem value="Отменен">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Товары</Label>
            </div>
            
            <Tabs defaultValue="existing">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Существующие товары</TabsTrigger>
                <TabsTrigger value="custom">Свой товар</TabsTrigger>
              </TabsList>
              
              <TabsContent value="existing" className="space-y-4 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExistingProductToOrder}
                  disabled={products.length === 0 || products.every((p) => orderProducts.some((op) => op.productId === p.id))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить существующий товар
                </Button>
                
                {products.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Нет доступных товаров. Добавьте товары в каталог или используйте вкладку "Свой товар".
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4 pt-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-3">
                    <Label htmlFor="newProductName">Название</Label>
                    <Input
                      id="newProductName"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="Название товара"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newProductPrice">Цена (тг)</Label>
                    <Input
                      id="newProductPrice"
                      type="number"
                      min="0"
                      step="1"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newProductQuantity">Количество</Label>
                    <Input
                      id="newProductQuantity"
                      type="number"
                      min="1"
                      value={newProductQuantity}
                      onChange={(e) => setNewProductQuantity(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={addCustomProductToOrder}
                      disabled={!newProductName || !newProductPrice || parseFloat(newProductPrice) <= 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {orderProducts.length === 0 ? (
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                Нет выбранных товаров
              </div>
            ) : (
              <div className="space-y-3">
                {orderProducts.map((product, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr,auto,auto,auto] gap-2 items-center border rounded-md p-2"
                  >
                    {product.productId.startsWith('custom-') ? (
                      <div className="font-medium">{product.name}</div>
                    ) : (
                      <Select
                        value={product.productId}
                        onValueChange={(value) => handleProductSelect(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите товар" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Добавляем текущий товар, даже если его нет в списке доступных */}
                          <SelectItem key={product.productId} value={product.productId}>
                            {product.name}
                          </SelectItem>
                          
                          {/* Добавляем остальные доступные товары */}
                          {products
                            .filter((p) => p.id !== product.productId && !orderProducts.some((op, i) => i !== index && op.productId === p.id))
                            .map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}

                    <Input
                      type="number"
                      min="1"
                      className="w-20"
                      value={product.quantity}
                      onChange={(e) => updateOrderProduct(index, "quantity", parseInt(e.target.value) || 1)}
                    />

                    {product.productId.startsWith('custom-') ? (
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        className="w-20"
                        value={product.price}
                        onChange={(e) => updateOrderProduct(index, "price", parseFloat(e.target.value) || 0)}
                      />
                    ) : (
                      <div className="text-right w-20">
                        {product.price.toFixed(0)} тг
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProductFromOrder(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex justify-end border-t pt-2">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Итого:</div>
                    <div className="font-semibold">{totalAmount.toFixed(0)} тг</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={orderProducts.length === 0}>
              {isEditMode ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
