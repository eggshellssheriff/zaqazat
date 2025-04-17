
import { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";

export interface SearchProps {
  type: "products" | "orders";
  className?: string;
}

export function Search({ type, className }: SearchProps) {
  const { searchFilters, setSearchFilters } = useApp();
  const [searchText, setSearchText] = useState(searchFilters.query || "");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchFilters({
        ...searchFilters,
        type,
        query: searchText,
      });
    }, 300); // Debounce time in ms

    return () => clearTimeout(debounceTimer);
  }, [searchText, searchFilters, setSearchFilters, type]);

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <div className={`relative w-full ${className || ""}`}>
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={
          type === "products" ? "Поиск товаров..." : "Поиск заказов..."
        }
        className="w-full pl-9 pr-9"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {searchText && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-2.5"
          aria-label="Очистить поиск"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
