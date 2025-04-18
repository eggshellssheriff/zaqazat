import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ProductForm } from "@/components/ProductForm";
import { Badge } from "@/components/ui/badge";
import { FunctionPanel } from "@/components/FunctionPanel";
import { Plus, ArrowUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Products = () => {
  const { products, filteredProducts } = useApp();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleScroll = () => {
    if (contentRef.current) {
      setShowScrollTop(contentRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <Layout title="Товары" contentRef={contentRef}>
      <div className="flex flex-col gap-4 pb-20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-3">Товары</h1>
            <Badge variant="outline" className="mr-2">
              {products.length}
            </Badge>
          </div>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            {!isMobile && "Добавить товар"}
          </Button>
        </div>

        <FunctionPanel type="products" />

        {products.length === 0 ? (
          <div className="border rounded-lg p-4 sm:p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Нет товаров</h3>
            <p className="text-muted-foreground mb-4">
              Добавьте первый товар, чтобы начать управление
            </p>
            <Button onClick={() => setAddDialogOpen(true)} className="bg-green-500 hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" />
              Добавить товар
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="border rounded-lg p-4 sm:p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Товары не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode="grid" />
            ))}
          </div>
        )}
      </div>

      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full shadow-md z-50"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      <ProductForm open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </Layout>
  );
};

export default Products;
