
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/OrderCard";
import { OrderForm } from "@/components/OrderForm";
import { Search } from "@/components/Search";
import { Plus } from "lucide-react";

const Orders = () => {
  const { orders, products } = useApp();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = searchQuery
    ? orders.filter((order) =>
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  return (
    <Layout title="Заказы">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      <OrderForm open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </Layout>
  );
};

export default Orders;
