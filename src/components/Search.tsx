
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, Search as SearchIcon, X } from "lucide-react";
import { useApp } from "@/lib/context";

interface SearchProps {
  type: "products" | "orders";
}

export function Search({ type }: SearchProps) {
  const { products, orders, setSearchFilters } = useApp();
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Apply filters as user types or changes filter values
  useEffect(() => {
    setSearchFilters({
      type,
      query,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minQuantity: minQuantity ? parseInt(minQuantity) : undefined,
      maxQuantity: maxQuantity ? parseInt(maxQuantity) : undefined
    });
  }, [query, minPrice, maxPrice, minQuantity, maxQuantity, type, setSearchFilters]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinQuantity("");
    setMaxQuantity("");
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
    </div>
  );
}
