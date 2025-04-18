
import { useState } from "react";
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSelectMode, setIsSelectMode] = useState(false);
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
  
  const toggleViewMode = () => {
    const newMode = viewMode === "grid" ? "list" : "grid";
    setViewMode(newMode);
  };
  
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
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
    setSearchFilters({ query: value });
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
  
  return (
    <div 
      className={cn(
        "function-panel border rounded-lg bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-300 flex items-center gap-2 p-2",
        isCollapsed ? "w-auto" : "w-full"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapse}
        className="shrink-0"
        title={isCollapsed ? "Развернуть панель" : "Свернуть панель"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      
      <div className={cn(
        "flex items-center gap-2 transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-0" : "w-full"
      )}>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={toggleViewMode}
          title={viewMode === "grid" ? "Список" : "Плитки"}
        >
          {viewMode === "grid" ? (
            <List className="h-4 w-4" />
          ) : (
            <Grid2X2 className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant={isSelectMode ? "default" : "outline"}
          size="icon"
          onClick={toggleSelectMode}
          title={isSelectMode ? "Выйти из режима выбора" : "Выбрать несколько"}
        >
          <Check className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
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
              className="w-[200px] h-9"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          )}
        </div>
        
        <Button
          variant={sortOption !== "default" ? "default" : "outline"}
          size="icon"
          onClick={cycleSortOption}
          title="Изменить сортировку"
        >
          {getSortIcon()}
        </Button>
      </div>
    </div>
  );
}
