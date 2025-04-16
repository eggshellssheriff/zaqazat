
import React, { useState } from "react";
import { useApp } from "@/lib/context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderForm } from "./OrderForm";
import { AlertTriangle, Calendar, Edit, Trash, User } from "lucide-react";

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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Format the date to a more readable format
  const formattedDate = new Date(order.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = () => {
    deleteOrder(order.id);
    setShowDeleteDialog(false);
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "выполнен":
        return "default";
      case "в обработке":
        return "secondary";
      case "отменен":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{order.customerName}</CardTitle>
            <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
          </div>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Товары:</div>
            <ul className="list-disc list-inside space-y-0.5">
              {order.products.map((product) => (
                <li key={product.productId} className="text-sm">
                  {product.name} ({product.quantity} шт x {product.price} ₽)
                </li>
              ))}
            </ul>
            <div className="text-sm font-medium mt-2">
              Итого: {order.totalAmount} ₽
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Удалить
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Редактировать
          </Button>
        </CardFooter>
      </Card>

      <OrderForm
        order={order}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Удалить заказ
            </DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот заказ? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
