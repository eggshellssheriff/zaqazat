
import { useState } from "react";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OrderForm } from "./OrderForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, User, Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Order = {
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

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const { deleteOrder } = useApp();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const handleDelete = () => {
    deleteOrder(order.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Новый</Badge>;
      case "processing":
        return <Badge variant="secondary">В обработке</Badge>;
      case "shipped":
        return <Badge variant="primary">Отправлен</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Доставлен
        </Badge>;
      case "cancelled":
        return <Badge variant="destructive">Отменен</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-lg">Заказ #{order.id.slice(-4)}</h3>
            {getStatusBadge(order.status)}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{order.customerName}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(order.date)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4" />
              <span>{order.products.length} товаров</span>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <h4 className="font-medium mb-2">Товары:</h4>
            <ul className="space-y-2 text-sm">
              {order.products.slice(0, 3).map((product, index) => (
                <li key={index} className="flex justify-between">
                  <div className="flex-1">
                    <span>{product.name}</span>
                    <span className="text-muted-foreground"> × {product.quantity}</span>
                  </div>
                  <span>{(product.price * product.quantity).toFixed(2)} ₽</span>
                </li>
              ))}
              
              {order.products.length > 3 && (
                <li className="text-sm text-muted-foreground">
                  И еще {order.products.length - 3} товаров
                </li>
              )}
            </ul>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-2 border-t">
            <span className="font-medium">Итого:</span>
            <span className="font-semibold">{order.totalAmount.toFixed(2)} ₽</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between gap-2 p-4 pt-0 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Изменить
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удаление заказа</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите удалить заказ #{order.id.slice(-4)}?
                  Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
      
      <OrderForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialData={order}
      />
    </>
  );
}
