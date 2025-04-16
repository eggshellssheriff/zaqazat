
import { useState } from "react";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductForm } from "./ProductForm";
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
import { Pencil, Trash2, MinusCircle, PlusCircle, ImageOff } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string | null;
};

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { deleteProduct, adjustQuantity } = useApp();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const handleDelete = () => {
    deleteProduct(product.id);
  };

  const handleQuantityChange = (amount: number) => {
    adjustQuantity(product.id, amount);
  };

  if (viewMode === "list") {
    return (
      <>
        <Card className="overflow-hidden">
          <div className="flex items-center p-3">
            <div className="h-16 w-16 mr-4 bg-muted/20 flex-shrink-0 rounded overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageOff className="h-6 w-6 text-muted" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-base truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {product.description || "Нет описания"}
                  </p>
                </div>
                <div className="flex flex-col items-end ml-2">
                  <p className="font-semibold whitespace-nowrap">{product.price.toFixed(0)} тг</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={product.quantity <= 0}
                    >
                      <MinusCircle className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center font-mono text-sm">{product.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Изменить
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="h-7 text-xs">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Удалить
                    </Button>
                  </AlertDialogTrigger>
                  
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удаление товара</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы уверены, что хотите удалить товар "{product.name}"?
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
              </div>
            </div>
          </div>
        </Card>
        
        <ProductForm
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          initialData={product}
        />
      </>
    );
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-muted/20">
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
        
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="font-semibold text-right">{product.price.toFixed(0)} тг</p>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            {product.description || "Нет описания"}
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 p-4 pt-0 border-t">
          <div className="flex items-center justify-between w-full">
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
          
          <div className="flex justify-between gap-2">
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
                  <AlertDialogTitle>Удаление товара</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены, что хотите удалить товар "{product.name}"?
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
          </div>
        </CardFooter>
      </Card>
      
      <ProductForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialData={product}
      />
    </>
  );
}
