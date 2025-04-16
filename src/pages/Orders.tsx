
import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/OrderCard";
import { OrderForm } from "@/components/OrderForm";
import { Search } from "@/components/Search";
import { Badge } from "@/components/ui/badge";
import { Plus, Grid2X2, List, ArrowUp } from "lucide-react";

const Orders = () => {
  const { orders, products } = useApp();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredOrders = searchQuery
    ? orders.filter((order) =>
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  // Обработчик прокрутки для кнопки "вверх"
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
    <Layout title="Заказы" contentRef={contentRef}>
      <div className="flex flex-col gap-6">
        <div className="sticky top-0 z-10 bg-background pt-2 pb-4 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-3">Заказы</h1>
              <Badge variant="outline" className="mr-2">
                {orders.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Search type="orders" />
            <Button 
              onClick={() => setAddDialogOpen(true)} 
              disabled={products.length === 0}
              title={products.length === 0 ? "Добавьте товары, чтобы создать заказ" : ""}
            >
              <Plus className="mr-2 h-4 w-4" />
              Создать заказ
            </Button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Нет заказов</h3>
            <p className="text-muted-foreground mb-4">
              Создайте первый заказ, чтобы начать управление
            </p>
            <Button 
              onClick={() => setAddDialogOpen(true)} 
              disabled={products.length === 0}
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
        ) : (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )
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

      <OrderForm open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </Layout>
  );
};

export default Orders;
