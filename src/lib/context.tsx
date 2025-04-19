import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string | null;
  createdAt?: string; // Add creation date
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
  createdAt?: string; // Add creation date
};

type Theme = "light" | "dark";

type SearchFilters = {
  type: "products" | "orders" | "database";
  query: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
};

type SortOption = "default" | "alphabetical" | "priceLowToHigh" | "priceHighToLow" | "dateNewest" | "dateOldest";

type Settings = {
  showCurrencyConverter: boolean;
};

// Database entry for phone numbers and associated orders
type PhoneEntry = {
  phoneNumber: string;
  orders: Array<{
    id: string;
    date: string;
    productName: string;
    totalAmount: number;
    isDeleted?: boolean; // Flag to mark if the order has been deleted from the main list
  }>;
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
  database: PhoneEntry[];
  filteredDatabase: PhoneEntry[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  adjustQuantity: (id: string, changeAmount: number) => void;
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  updateOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;
  deleteOrder: (id: string) => void;
  deletePhoneEntry: (phoneNumber: string) => void;
  deleteOrderFromDatabase: (phoneNumber: string, orderId: string) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  setSortOption: (option: SortOption) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    // Add createdAt dates to existing products if they don't have one
    const existingProducts = savedProducts ? JSON.parse(savedProducts) : [];
    return existingProducts.map((product: Product) => ({
      ...product,
      createdAt: product.createdAt || new Date().toISOString(),
    }));
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    // Update any existing orders to have valid status and createdAt dates
    const existingOrders = savedOrders ? JSON.parse(savedOrders) : [];
    return existingOrders.map((order: Order) => ({
      ...order,
      status: ["в пути", "на складе"].includes(order.status) ? order.status : "в пути",
      createdAt: order.createdAt || new Date().toISOString(),
    }));
  });

  const [database, setDatabase] = useState<PhoneEntry[]>(() => {
    const savedDatabase = localStorage.getItem("database");
    return savedDatabase ? JSON.parse(savedDatabase) : [];
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as Theme) || "light";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [searchFiltersState, setSearchFiltersState] = useState<SearchFilters>({
    type: "products",
    query: "",
    minPrice: undefined,
    maxPrice: undefined,
    minQuantity: undefined,
    maxQuantity: undefined
  });

  const [sortOption, setSortOption] = useState<SortOption>("dateNewest");

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
        
        case "dateNewest":
          // Sort by creation date, newest first
          const aDateNew = new Date('createdAt' in a && a.createdAt ? a.createdAt : 0);
          const bDateNew = new Date('createdAt' in b && b.createdAt ? b.createdAt : 0);
          return bDateNew.getTime() - aDateNew.getTime();
          
        case "dateOldest":
          // Sort by creation date, oldest first
          const aDateOld = new Date('createdAt' in a && a.createdAt ? a.createdAt : 0);
          const bDateOld = new Date('createdAt' in b && b.createdAt ? b.createdAt : 0);
          return aDateOld.getTime() - bDateOld.getTime();
          
        default:
          return 0;
      }
    });
  };

  // Fix the type error by creating a proper setSearchFilters function
  const setSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFiltersState(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
  };

  // Use searchFiltersState instead of searchFilters in the filtered data calculations
  const filteredProducts = applySorting(
    products.filter(product => {
      if (searchFiltersState.type !== "products") return true;
      
      const matchesQuery = searchFiltersState.query.trim() === "" || 
        product.name.toLowerCase().includes(searchFiltersState.query.toLowerCase()) ||
        product.description.toLowerCase().includes(searchFiltersState.query.toLowerCase()) ||
        product.price.toString().includes(searchFiltersState.query);
      
      const matchesPrice = 
        (searchFiltersState.minPrice === undefined || product.price >= searchFiltersState.minPrice) &&
        (searchFiltersState.maxPrice === undefined || product.price <= searchFiltersState.maxPrice);
      
      const matchesQuantity = 
        (searchFiltersState.minQuantity === undefined || product.quantity >= searchFiltersState.minQuantity) &&
        (searchFiltersState.maxQuantity === undefined || product.quantity <= searchFiltersState.maxQuantity);
      
      return matchesQuery && matchesPrice && matchesQuantity;
    }),
    sortOption
  );

  // Filtered orders based on search and filters, with sorting applied
  const filteredOrders = applySorting(
    orders.filter(order => {
      if (searchFiltersState.type !== "orders") return true;
      
      // Check for ID search using # prefix
      const searchTermForId = searchFiltersState.query.startsWith('#') 
        ? searchFiltersState.query.substring(1) 
        : '';
        
      const matchesId = searchTermForId
        ? order.id.endsWith(searchTermForId)
        : false;
      
      const matchesNameOrStandardId = searchFiltersState.query.trim() === "" || 
        order.customerName.toLowerCase().includes(searchFiltersState.query.toLowerCase()) ||
        order.id.includes(searchFiltersState.query);
      
      // Search in products inside the order
      const matchesProductNames = searchFiltersState.query.trim() === "" || 
        order.products.some(p => p.name.toLowerCase().includes(searchFiltersState.query.toLowerCase()));
      
      // Filter by order total price
      const matchesPrice = 
        (searchFiltersState.minPrice === undefined || order.totalAmount >= searchFiltersState.minPrice) &&
        (searchFiltersState.maxPrice === undefined || order.totalAmount <= searchFiltersState.maxPrice);
      
      return (matchesNameOrStandardId || matchesProductNames || matchesId) && matchesPrice;
    }),
    sortOption
  );
  
  // Filtered database entries
  const filteredDatabase = database.filter(entry => {
    if (searchFiltersState.type !== "database") return true;
    
    // For database search, we match partial phone number sequences
    if (searchFiltersState.query.trim() === "") return true;
    
    // Check if the searchQuery is a continuous sequence of digits within the phone number
    const digitsOnly = searchFiltersState.query.replace(/\D/g, '');
    if (digitsOnly === "") return true;
    
    return entry.phoneNumber.includes(digitsOnly);
  });

  // Save to localStorage effects
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);
  
  useEffect(() => {
    localStorage.setItem("database", JSON.stringify(database));
  }, [database]);

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

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(product => product.id === id);
    setProducts(products.filter((product) => product.id !== id));
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
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

  // Helper to update database when adding, updating, or deleting orders
  const updatePhoneDatabase = (order: Order, isDeleted = false) => {
    if (!order.phoneNumber) return;

    setDatabase(prevDatabase => {
      // Find existing phone entry
      const existingEntryIndex = prevDatabase.findIndex(
        entry => entry.phoneNumber === order.phoneNumber
      );
      
      // Prepare order info for database
      const orderInfo = {
        id: order.id,
        date: order.date,
        productName: order.products.length > 0 ? order.products[0].name : "Без товара",
        totalAmount: order.totalAmount,
        isDeleted: isDeleted
      };
      
      if (existingEntryIndex >= 0) {
        // Update existing entry
        const updatedDatabase = [...prevDatabase];
        const existingEntry = updatedDatabase[existingEntryIndex];
        
        // Check if this order already exists in the entry
        const orderIndex = existingEntry.orders.findIndex(o => o.id === order.id);
        
        if (orderIndex >= 0) {
          // Update existing order
          existingEntry.orders[orderIndex] = orderInfo;
        } else {
          // Add new order to existing entry
          existingEntry.orders.push(orderInfo);
        }
        
        updatedDatabase[existingEntryIndex] = existingEntry;
        return updatedDatabase;
      } else {
        // Create new entry
        return [...prevDatabase, {
          phoneNumber: order.phoneNumber,
          orders: [orderInfo]
        }];
      }
    });
  };

  const addOrder = (order: Omit<Order, "id" | "createdAt">) => {
    // Ensure order has one of the valid statuses
    const validStatus = ["в пути", "на складе"].includes(order.status || "") 
      ? order.status 
      : "в пути";

    const newOrder = {
      ...order,
      id: Date.now().toString(),
      status: validStatus,
      createdAt: new Date().toISOString(),
    };
    
    setOrders([...orders, newOrder]);
    
    // Update database if phone number is provided
    if (order.phoneNumber) {
      updatePhoneDatabase(newOrder);
    }
    
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
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
    
    // Update database if phone number is provided
    if (updatedOrder.phoneNumber) {
      updatePhoneDatabase(validatedOrder);
    }
    
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
    });
  };

  const updateOrderStatus = (id: string, status: string) => {
    // Validate that the status is one of the allowed values
    if (!["в пути", "на складе"].includes(status)) {
      console.error("Invalid status:", status);
      return;
    }

    const updatedOrder = orders.find(order => order.id === id);
    
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
    
    // Update database if order has a phone number
    if (updatedOrder && updatedOrder.phoneNumber) {
      updatePhoneDatabase({...updatedOrder, status});
    }
    
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
    });
  };

  const deleteOrder = (id: string) => {
    const orderToDelete = orders.find(order => order.id === id);
    
    // Mark as deleted in the database but don't remove
    if (orderToDelete && orderToDelete.phoneNumber) {
      updatePhoneDatabase(orderToDelete, true);
    }
    
    setOrders(orders.filter((order) => order.id !== id));
    
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
    });
  };
  
  const deletePhoneEntry = (phoneNumber: string) => {
    setDatabase(database.filter(entry => entry.phoneNumber !== phoneNumber));
    
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
    });
  };

  const deleteOrderFromDatabase = (phoneNumber: string, orderId: string) => {
    setDatabase(prevDatabase => {
      return prevDatabase.map(entry => {
        if (entry.phoneNumber === phoneNumber) {
          // Filter out the specific order
          return {
            ...entry,
            orders: entry.orders.filter(order => order.id !== orderId)
          };
        }
        return entry;
      }).filter(entry => entry.orders.length > 0); // Remove entries with no orders
    });
    
    toast({
      title: "Успех",
      description: "",
      className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white border-none py-2 px-4 rounded w-auto",
      duration: 2000,
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
        searchFilters: searchFiltersState,
        sortOption,
        settings,
        database,
        filteredDatabase,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustQuantity,
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        deletePhoneEntry,
        deleteOrderFromDatabase,
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
