
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ImageOff, MinusCircle, PlusCircle } from "lucide-react";
import { useApp } from "@/lib/context";

interface ProductModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    image: string | null;
  };
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { adjustQuantity } = useApp();
  
  const handleQuantityChange = (amount: number) => {
    adjustQuantity(product.id, amount);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <Card className="product-modal bg-card" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="relative pb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-10" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="h-48 overflow-hidden bg-muted/20 rounded-md">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageOff className="h-12 w-12 text-muted" />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="font-semibold text-right">{product.price.toFixed(0)} тг</p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">В наличии:</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleQuantityChange(-1)}
                disabled={product.quantity <= 0}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              
              <span className="w-8 text-center font-mono">{product.quantity}</span>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleQuantityChange(1)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Описание:</h4>
            <p className="text-sm text-muted-foreground">
              {product.description || "Нет описания"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
