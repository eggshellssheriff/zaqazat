
import React, { useState } from "react";
import { useApp } from "@/lib/context";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { OrderModal } from "./OrderModal";
import { AlertTriangle, Calendar, Edit, Trash, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Order = {
  id: string;
  customerName: string;
  date: string;
  status: string;
  phoneNumber?: string;
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
  const { deleteOrder, updateOrderStatus } = useApp();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Format the date to DD.MM.YY format
  const formattedDate = new Date(order.date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });

  const handleDelete = () => {
    deleteOrder(order.id);
    setShowDeleteDialog(false);
  };

  const handleStatusChange = (status: string) => {
    updateOrderStatus(order.id, status);
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "на складе":
        return "default";
      case "в пути":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Limited status options
  const statuses = ["в пути", "на складе"];

  return (
    <>
      <Card className="overflow-hidden cursor-pointer" onClick={() => setShowDetailsModal(true)}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{order.customerName}</CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-1">
            <div className="text-sm">
              {order.products[0]?.name || "Нет товаров"}
              {order.products.length > 1 && ` и ещё ${order.products.length - 1} товар(ов)`}
            </div>
            {order.phoneNumber && (
              <div className="text-sm text-muted-foreground">
                Телефон: {order.phoneNumber}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
          >
            <Trash className="h-4 w-4 mr-1" />
            Удалить
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowEditDialog(true);
              }}
            >
              <Edit className="h-4 w-4 mr-1" />
              Редактировать
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 pl-2 pr-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge variant={getBadgeVariant(order.status)} className="mr-1">
                    {order.status}
                  </Badge>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(status);
                    }}
                    className={status === order.status ? "bg-accent font-medium" : ""}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>

      <OrderForm
        initialData={order}
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

      {showDetailsModal && (
        <OrderModal 
          order={order} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}
    </>
  );
}
