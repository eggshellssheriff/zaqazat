
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Filter, Search as SearchIcon, X } from "lucide-react";
import { useApp } from "@/lib/context";
import { useNavigate } from "react-router-dom";

interface SearchProps {
  type: "products" | "orders";
}

export function Search({ type }: SearchProps) {
  const { products, orders } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.trim() || minPrice || maxPrice || minQuantity || maxQuantity) {
      let results: any[] = [];

      if (type === "products") {
        results = products.filter((product) => {
          // Enhanced search by name to include partial matches
          const matchesQuery = query.trim() === "" || 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.price.toString().includes(query); // Search by price
          
          const matchesPrice = 
            (minPrice === "" || product.price >= parseFloat(minPrice)) &&
            (maxPrice === "" || product.price <= parseFloat(maxPrice));
          
          const matchesQuantity = 
            (minQuantity === "" || product.quantity >= parseInt(minQuantity)) &&
            (maxQuantity === "" || product.quantity <= parseInt(maxQuantity));
          
          return matchesQuery && matchesPrice && matchesQuantity;
        });
      } else {
        results = orders.filter((order) => {
          // Enhanced search by customer name or by product name within orders
          const matchesNameOrId = query.trim() === "" || 
            order.customerName.toLowerCase().includes(query.toLowerCase()) ||
            order.id.includes(query);
          
          // Search in products inside the order
          const matchesProductNames = order.products.some(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
          );
          
          // Search by order total price
          const matchesPrice = query.trim() === "" || 
            order.totalAmount.toString().includes(query) ||
            (minPrice === "" || order.totalAmount >= parseFloat(minPrice)) &&
            (maxPrice === "" || order.totalAmount <= parseFloat(maxPrice));
          
          return (matchesNameOrId || matchesProductNames) && matchesPrice;
        });
      }

      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query, minPrice, maxPrice, minQuantity, maxQuantity, products, orders, type]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinQuantity("");
    setMaxQuantity("");
  };

  const handleItemClick = (id: string) => {
    // This is a placeholder for future functionality
    // Could navigate to a detailed view
    console.log(`Clicked on item with ID: ${id}`);
    setSearchResults([]);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={type === "products" ? "Поиск товаров (имя, цена)..." : "Поиск заказов (клиент, товар, цена)..."}
            className="pl-9"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Фильтры</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="minPrice">Цена от</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="maxPrice">Цена до</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="∞"
                    />
                  </div>
                </div>
                
                {type === "products" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="minQuantity">Кол-во от</Label>
                      <Input
                        id="minQuantity"
                        type="number"
                        value={minQuantity}
                        onChange={(e) => setMinQuantity(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="maxQuantity">Кол-во до</Label>
                      <Input
                        id="maxQuantity"
                        type="number"
                        value={maxQuantity}
                        onChange={(e) => setMaxQuantity(e.target.value)}
                        placeholder="∞"
                      />
                    </div>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {searchResults.length > 0 && query && (
        <div className="absolute top-full left-0 right-0 mt-1 border rounded-md bg-background shadow-lg z-10 max-h-64 overflow-auto">
          {searchResults.map((item) => (
            <button
              key={item.id}
              className="w-full px-4 py-2 text-left hover:bg-muted flex items-center justify-between"
              onClick={() => handleItemClick(item.id)}
            >
              <div>
                {type === "products" ? (
                  <>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.price.toFixed(0)} тг · {item.quantity} шт.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-medium">Заказ #{item.id.slice(-4)}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.customerName} · {item.totalAmount.toFixed(0)} тг
                    </div>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
