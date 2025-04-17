
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

type Theme = "light" | "dark";

type SearchFilters = {
  type: "products" | "orders";
  query: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
};

type SortOption = "default" | "alphabetical" | "priceLowToHigh" | "priceHighToLow";

type Settings = {
  showCurrencyConverter: boolean;
};

interface AppContextType {
  products: Product[];
  orders: Order[];
  theme: Theme;
  sidebarOpen: boolean;
  filteredProducts: Product[];
  filteredOrders: Order[];
  searchFilters: SearchFilters;
  sortOption: SortOption;
  settings: Settings;
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
  setSearchFilters: (filters: SearchFilters) => void;
  setSortOption: (option: SortOption) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    // Update any existing orders to have one of the valid statuses
    const existingOrders = savedOrders ? JSON.parse(savedOrders) : [];
    return existingOrders.map((order: Order) => ({
      ...order,
      status: ["в пути", "на складе"].includes(order.status) ? order.status : "в пути"
    }));
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as Theme) || "light";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: "products",
    query: "",
    minPrice: undefined,
    maxPrice: undefined,
    minQuantity: undefined,
    maxQuantity: undefined
  });

  const [sortOption, setSortOption] = useState<SortOption>("default");

  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings 
      ? JSON.parse(savedSettings) 
      : { showCurrencyConverter: true };
  });
  
  // Helper function to apply sorting
  const applySorting = <T extends Product | Order>(items: T[], option: SortOption): T[] => {
    if (option === "default") return items;
    
    return [...items].sort((a, b) => {
      switch (option) {
        case "alphabetical":
          // For orders, sort by customer name; for products, sort by name
          const aName = 'customerName' in a ? a.customerName : a.name;
          const bName = 'customerName' in b ? b.customerName : b.name;
          return aName.localeCompare(bName);
        
        case "priceLowToHigh":
          // For orders, sort by total amount; for products, sort by price
          const aPrice = 'totalAmount' in a ? a.totalAmount : a.price;
          const bPrice = 'totalAmount' in b ? b.totalAmount : b.price;
          return aPrice - bPrice;
        
        case "priceHighToLow":
          // For orders, sort by total amount; for products, sort by price
          const aPriceDesc = 'totalAmount' in a ? a.totalAmount : a.price;
          const bPriceDesc = 'totalAmount' in b ? b.totalAmount : b.price;
          return bPriceDesc - aPriceDesc;
        
        default:
          return 0;
      }
    });
  };

  // Filtered products based on search and filters, with sorting applied
  const filteredProducts = applySorting(
    products.filter(product => {
      if (searchFilters.type !== "products") return true;
      
      const matchesQuery = searchFilters.query.trim() === "" || 
        product.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        product.description.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        product.price.toString().includes(searchFilters.query);
      
      const matchesPrice = 
        (searchFilters.minPrice === undefined || product.price >= searchFilters.minPrice) &&
        (searchFilters.maxPrice === undefined || product.price <= searchFilters.maxPrice);
      
      const matchesQuantity = 
        (searchFilters.minQuantity === undefined || product.quantity >= searchFilters.minQuantity) &&
        (searchFilters.maxQuantity === undefined || product.quantity <= searchFilters.maxQuantity);
      
      return matchesQuery && matchesPrice && matchesQuantity;
    }),
    sortOption
  );

  // Filtered orders based on search and filters, with sorting applied
  const filteredOrders = applySorting(
    orders.filter(order => {
      if (searchFilters.type !== "orders") return true;
      
      const matchesNameOrId = searchFilters.query.trim() === "" || 
        order.customerName.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
        order.id.includes(searchFilters.query);
      
      // Search in products inside the order
      const matchesProductNames = searchFilters.query.trim() === "" || 
        order.products.some(p => p.name.toLowerCase().includes(searchFilters.query.toLowerCase()));
      
      // Filter by order total price
      const matchesPrice = 
        (searchFilters.minPrice === undefined || order.totalAmount >= searchFilters.minPrice) &&
        (searchFilters.maxPrice === undefined || order.totalAmount <= searchFilters.maxPrice);
      
      return (matchesNameOrId || matchesProductNames) && matchesPrice;
    }),
    sortOption
  );

  // Save to localStorage effects
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

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

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
    // Ensure order has one of the valid statuses
    const validStatus = ["в пути", "на складе"].includes(order.status || "") 
      ? order.status 
      : "в пути";

    const newOrder = {
      ...order,
      id: Date.now().toString(),
      status: validStatus,
    };
    
    setOrders([...orders, newOrder]);
    toast({
      title: "Заказ создан",
      description: `Заказ #${newOrder.id.slice(-4)} успешно создан`,
    });
  };

  const updateOrder = (updatedOrder: Order) => {
    // Ensure updated order has one of the valid statuses
    const validStatus = ["в пути", "на складе"].includes(updatedOrder.status) 
      ? updatedOrder.status 
      : "в пути";

    const validatedOrder = {
      ...updatedOrder,
      status: validStatus
    };

    setOrders(
      orders.map((order) =>
        order.id === validatedOrder.id ? validatedOrder : order
      )
    );
    
    toast({
      title: "Заказ обновлен",
      description: `Заказ #${validatedOrder.id.slice(-4)} успешно обновлен`,
    });
  };

  const updateOrderStatus = (id: string, status: string) => {
    // Validate that the status is one of the allowed values
    if (!["в пути", "на складе"].includes(status)) {
      console.error("Invalid status:", status);
      return;
    }

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
        filteredProducts,
        filteredOrders,
        searchFilters,
        sortOption,
        settings,
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
        setSearchFilters,
        setSortOption,
        updateSettings,
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
