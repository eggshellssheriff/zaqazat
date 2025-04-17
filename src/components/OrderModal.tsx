
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderModalProps {
  order: {
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
  onClose: () => void;
}

export function OrderModal({ order, onClose }: OrderModalProps) {
  // Format the date to DD.MM.YY format
  const formattedDate = new Date(order.date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <Card className="product-modal bg-card" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="relative flex flex-col gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-10" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-semibold">{order.customerName}</h2>
          <div className="flex items-center gap-2">
            <Badge>{order.status}</Badge>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          {order.phoneNumber && (
            <p className="text-sm mt-2">Телефон: {order.phoneNumber}</p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Товары:</h3>
            <ul className="space-y-2">
              {order.products.map((product) => (
                <li key={product.productId} className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <div className="text-xs text-muted-foreground">
                      {product.quantity} шт.
                    </div>
                  </div>
                  <span className="font-medium">{product.price.toFixed(0)} тг</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Итого:</span>
            <span className="font-bold">{order.totalAmount.toFixed(0)} тг</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
