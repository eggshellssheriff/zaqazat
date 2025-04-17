
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, PhoneCall, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrderModalProps {
  order: {
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
        <CardHeader className="relative flex flex-col gap-1 pb-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-10" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Product image */}
          {order.image && (
            <div className="w-full h-[180px] -mx-6 -mt-6 mb-4 relative overflow-hidden">
              <img 
                src={order.image} 
                alt={order.products[0]?.name || "Заказ"}
                className="w-full h-full object-cover"
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Badge>{order.status}</Badge>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          
          <h2 className="text-xl font-semibold pr-8">{order.products[0]?.name}</h2>
          
          <p className="text-sm truncate">{order.customerName}</p>
          
          {order.phoneNumber && (
            <div className="flex items-center text-sm gap-1 text-muted-foreground">
              <PhoneCall className="h-3 w-3" /> 
              <a href={`tel:${order.phoneNumber}`} className="hover:underline">
                {order.phoneNumber}
              </a>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4 mt-4">
          {/* Description if available */}
          {order.description && (
            <div className="text-sm text-muted-foreground border-t pt-3">
              <p>{order.description}</p>
            </div>
          )}
          
          <div className="border-t pt-3">
            <h3 className="text-sm font-medium mb-2">Информация о товаре:</h3>
            <ul className="space-y-2">
              {order.products.map((product) => (
                <li key={product.productId} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {product.quantity} шт.
                    </span>
                  </div>
                  <span className="font-medium whitespace-nowrap">{product.price.toFixed(0)} тг</span>
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
