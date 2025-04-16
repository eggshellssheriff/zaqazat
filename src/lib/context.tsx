
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string | null;
};

type Order = {
  id: string;
  customerName: string;
  date: string;
  status: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
};

type Theme = "light" | "dark";

interface AppContextType {
  products: Product[];
  orders: Order[];
  theme: Theme;
  sidebarOpen: boolean;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustQuantity: (id: string, changeAmount: number) => void;
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;
  deleteOrder: (id: string) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as Theme) || "light";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Товар добавлен",
      description: `"${product.name}" успешно добавлен в каталог`,
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    toast({
      title: "Товар обновлен",
      description: `"${updatedProduct.name}" успешно обновлен`,
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(product => product.id === id);
    setProducts(products.filter((product) => product.id !== id));
    toast({
      title: "Товар удален",
      description: productToDelete ? `"${productToDelete.name}" удален из каталога` : "Товар удален из каталога",
      variant: "destructive",
    });
  };

  const adjustQuantity = (id: string, changeAmount: number) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const newQuantity = Math.max(0, product.quantity + changeAmount);
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
    };
    setOrders([...orders, newOrder]);
    toast({
      title: "Заказ создан",
      description: `Заказ #${newOrder.id.slice(-4)} успешно создан`,
    });
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders(
      orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    toast({
      title: "Заказ обновлен",
      description: `Заказ #${updatedOrder.id.slice(-4)} успешно обновлен`,
    });
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
    const orderNumber = id.slice(-4);
    toast({
      title: "Статус изменен",
      description: `Заказ #${orderNumber} теперь в статусе "${status}"`,
    });
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
    toast({
      title: "Заказ удален",
      description: `Заказ #${id.slice(-4)} успешно удален`,
      variant: "destructive",
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        theme,
        sidebarOpen,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustQuantity,
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        toggleTheme,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
