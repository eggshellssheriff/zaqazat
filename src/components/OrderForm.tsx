
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
  const [status, setStatus] = useState(initialData?.status || "new");
  const [orderProducts, setOrderProducts] = useState<
    Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }>
  >(initialData?.products || []);

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
      setStatus("new");
      setOrderProducts([]);
    }
  };

  const addProductToOrder = () => {
    // Only add if there are products available
    if (products.length === 0) return;
    
    // Filter products that aren't already in the order
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
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="shipped">Отправлен</SelectItem>
                  <SelectItem value="delivered">Доставлен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Товары</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProductToOrder}
                disabled={products.length === 0 || products.every((p) => orderProducts.some((op) => op.productId === p.id))}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить товар
              </Button>
            </div>
            
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
                    <Select
                      value={product.productId}
                      onValueChange={(value) => handleProductSelect(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите товар" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      min="1"
                      className="w-20"
                      value={product.quantity}
                      onChange={(e) => updateOrderProduct(index, "quantity", parseInt(e.target.value) || 1)}
                    />

                    <div className="text-right w-20">
                      {product.price.toFixed(2)} ₽
                    </div>

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
                    <div className="font-semibold">{totalAmount.toFixed(2)} ₽</div>
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
