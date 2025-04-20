import React, { useState } from "react";
import { useApp } from "@/lib/context";
import {
  Card,
  CardContent,
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
import { 
  AlertTriangle, 
  Calendar, 
  Edit, 
  Trash, 
  ChevronDown, 
  ImageOff,
  Hash
} from "lucide-react";
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

interface OrderCardProps {
  order: Order;
  viewMode: "grid" | "list";
}

export function OrderCard({ order, viewMode }: OrderCardProps) {
  const { deleteOrder, updateOrderStatus } = useApp();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(!!order.image);

  const formattedDate = new Date(order.date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });

  const shortId = order.id.slice(-4);

  const handleDelete = () => {
    deleteOrder(order.id);
    setShowDeleteDialog(false);
  };

  const handleStatusChange = (status: string) => {
    updateOrderStatus(order.id, status);
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "в пути":
        return "status-in-transit";
      case "на складе":
        return "status-in-stock";
      default:
        return "outline";
    }
  };

  const statuses = ["в пути", "на складе"];

  if (viewMode === "list") {
    return (
      <>
        <Card className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setShowDetailsModal(true)}>
          <div className="flex items-center p-3">
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate max-w-[120px]">{order.products[0]?.name || "Нет товаров"}</span>
                <Badge variant="outline" className="ml-1 text-xs px-1.5 py-0 shrink-0">
                  <Hash className="h-2.5 w-2.5 mr-0.5" />
                  {shortId}
                </Badge>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3 mr-1 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                title="Удалить"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                title="Редактировать"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditDialog(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <div className="text-sm font-medium px-2 w-[80px] text-right">{order.totalAmount.toLocaleString()} ₸</div>
            </div>
          </div>
        </Card>

        <OrderForm
          initialData={order}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          maxImageSize={1000}
        />

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-sm">
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

  return (
    <>
      <Card className="overflow-hidden cursor-pointer relative h-[200px]" onClick={() => setShowDetailsModal(true)}>
        <div className="flex p-3 h-full">
          <div className="flex-1 min-w-0 mr-3 flex flex-col">
            <div className="flex items-center mb-1">
              <h3 className="font-medium text-base truncate mr-1">
                {order.products[0]?.name || "Нет товаров"}
              </h3>
              <Badge variant="outline" className="text-xs px-1.5 py-0 shrink-0">
                <Hash className="h-2.5 w-2.5 mr-0.5" />
                {shortId}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 mr-1 shrink-0" />
              {formattedDate}
            </div>
            <div className="mt-1 truncate">
              {order.customerName}
            </div>
            
            <div className="flex gap-2 mt-auto">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                title="Удалить"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                title="Редактировать"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditDialog(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center">
                <span className="text-sm font-medium">{order.totalAmount.toLocaleString()} ₸</span>
              </div>
            </div>
          </div>
          
          <div className="w-[100px] flex flex-col">
            <div className="h-[100px] bg-muted/20 rounded overflow-hidden mb-2">
              {order.image ? (
                <img
                  src={order.image}
                  alt={order.products[0]?.name || "Заказ"}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isImageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setIsImageLoading(false)}
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageOff className="h-6 w-6 text-muted" />
                </div>
              )}
            </div>
            
            <div className="mt-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full justify-between hover:bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Badge variant={getBadgeVariant(order.status)} className="mr-1">
                      {order.status}
                    </Badge>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-32 bg-popover border shadow-md"
                >
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
          </div>
        </div>
      </Card>

      <OrderForm
        initialData={order}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        maxImageSize={1000}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm">
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
