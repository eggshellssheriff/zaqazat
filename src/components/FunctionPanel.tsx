
import { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronLeft,
  Grid2X2,
  List,
  Check,
  Search,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "default" | "priceLowToHigh" | "priceHighToLow";

export function FunctionPanel() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  
  const { setSortOption: setAppSortOption, setSearchFilters } = useApp();
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isCollapsed) {
      setIsSearchVisible(false);
    }
  };
  
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSearchFilters({ query: value, type: "all" }); // Fixed by adding the required 'type' property
  };
  
  const cycleSortOption = () => {
    const options: SortOption[] = ["priceHighToLow", "priceLowToHigh", "default"];
    const currentIndex = options.indexOf(sortOption);
    const nextOption = options[(currentIndex + 1) % options.length];
    setSortOption(nextOption);
    setAppSortOption(nextOption);
  };
  
  const getSortIcon = () => {
    switch (sortOption) {
      case "priceHighToLow":
        return <ArrowDownWideNarrow className="h-4 w-4" />;
      case "priceLowToHigh":
        return <ArrowDownNarrowWide className="h-4 w-4" />;
      default:
        return <ArrowDownWideNarrow className="h-4 w-4 opacity-50" />;
    }
  };

  // Reset search when component unmounts
  useEffect(() => {
    return () => {
      setSearchFilters({ query: "", type: "all" });
    };
  }, [setSearchFilters]);
  
  return (
    <div className="mb-4">
      <div 
        className={cn(
          "function-panel border rounded-lg bg-card/95 backdrop-blur-sm shadow-sm transition-all duration-300 overflow-hidden",
          isCollapsed ? "h-10" : "h-auto"
        )}
      >
        <div className="flex items-center p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="shrink-0 mr-2"
            title={isCollapsed ? "Развернуть панель" : "Свернуть панель"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
          )}>
            <Button
              variant={sortOption !== "default" ? "default" : "outline"}
              size="icon"
              onClick={cycleSortOption}
              title="Изменить сортировку"
            >
              {getSortIcon()}
            </Button>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={isSearchVisible ? "default" : "outline"}
                size="icon"
                onClick={toggleSearch}
                title={isSearchVisible ? "Скрыть поиск" : "Показать поиск"}
              >
                <Search className="h-4 w-4" />
              </Button>
              
              {isSearchVisible && (
                <Input
                  id="search-input"
                  type="search"
                  placeholder="Поиск..."
                  className="w-[200px] h-9 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
