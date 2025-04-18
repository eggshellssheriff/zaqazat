
import { useState } from "react";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductForm } from "./ProductForm";
import { ProductModal } from "./ProductModal";
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
  const [modalOpen, setModalOpen] = useState(false);
  
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
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <h3 
                className="font-medium text-base truncate cursor-pointer hover:text-primary/80"
                onClick={() => setModalOpen(true)}
              >
                {product.name}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-semibold whitespace-nowrap">{product.price.toFixed(0)} тг</p>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={product.quantity <= 0}
                >
                  <MinusCircle className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-mono">{product.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleQuantityChange(1)}
                >
                  <PlusCircle className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="h-7 w-7 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
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

        {modalOpen && (
          <ProductModal product={product} onClose={() => setModalOpen(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <Card className="h-full flex flex-col cursor-pointer" onClick={() => setModalOpen(true)}>
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
            <h3 className="font-medium text-lg truncate max-w-[60%]">{product.name}</h3>
            <p className="font-semibold text-right">{product.price.toFixed(0)} тг</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 p-4 pt-0 border-t">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm">В наличии:</span>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(-1);
                }}
                disabled={product.quantity <= 0}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              
              <span className="w-8 text-center font-mono">{product.quantity}</span>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(1);
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-10 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setEditDialogOpen(true);
              }}
              title="Изменить"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-10 p-0"
                  onClick={(e) => e.stopPropagation()}
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
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

      {modalOpen && (
        <ProductModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
