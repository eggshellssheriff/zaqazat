
import { useState, useRef, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/OrderCard";
import { OrderForm } from "@/components/OrderForm";
import { Badge } from "@/components/ui/badge";
import { FunctionPanel } from "@/components/FunctionPanel";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { Plus, ArrowUp, DollarSign } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Orders = () => {
  const { orders, products, filteredOrders, settings, setSearchFilters, setSortOption } = useApp();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      setShowScrollTop(contentRef.current.scrollTop > 300);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    return () => {
      setSearchFilters({ type: "orders", query: "" });
      setSortOption("dateNewest");
    };
  }, []);

  return (
    <Layout title="Заказы" contentRef={contentRef}>
      <div className="flex flex-col gap-4 pb-20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-3">Заказы</h1>
            <Badge variant="outline" className="mr-2">
              {orders.length}
            </Badge>
          </div>
          <Button 
            onClick={() => setAddDialogOpen(true)} 
            disabled={products.length === 0}
            title={products.length === 0 ? "Добавьте товары, чтобы создать заказ" : "Создать заказ"}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <FunctionPanel type="orders" onViewModeChange={setViewMode} />

        {orders.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Нет заказов</h3>
            <p className="text-muted-foreground mb-4">
              Создайте первый заказ, чтобы начать управление
            </p>
            <Button 
              onClick={() => setAddDialogOpen(true)} 
              disabled={products.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Создать заказ
            </Button>
            {products.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Сначала добавьте товары, чтобы создать заказ
              </p>
            )}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Заказы не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col gap-2"
          }>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>

      {settings.showCurrencyConverter && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-16 right-6 h-10 w-10 rounded-full shadow-md z-50 bg-secondary"
          onClick={() => setShowConverter(!showConverter)}
          title="Конвертер валют"
        >
          <DollarSign className="h-5 w-5" />
        </Button>
      )}

      {showConverter && settings.showCurrencyConverter && (
        <CurrencyConverter onClose={() => setShowConverter(false)} />
      )}

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

      <OrderForm open={addDialogOpen} onOpenChange={setAddDialogOpen} maxImageSize={1000} />
    </Layout>
  );
};

export default Orders;
