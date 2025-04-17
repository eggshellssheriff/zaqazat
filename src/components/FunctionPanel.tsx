
import { useState } from "react";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  Grid2X2,
  List,
  Check,
  Search,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type SortOption = "default" | "alphabetical" | "priceLowToHigh" | "priceHighToLow";

export function FunctionPanel() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  
  const { setSortOption: setAppSortOption, setSearchFilters } = useApp();
  const location = useLocation();
  
  // Determine the current page
  const isProductsPage = location.pathname.includes('/products');
  const isOrdersPage = location.pathname.includes('/orders');
  
  // If not on products or orders page, don't show the panel
  if (!isProductsPage && !isOrdersPage) {
    return null;
  }
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleViewMode = () => {
    const newMode = viewMode === "grid" ? "list" : "grid";
    setViewMode(newMode);
    // Here you would update app context with the new view mode
  };
  
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    // Here you would update app context with the selection mode
  };
  
  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    // Clear search when turning off search mode
    if (isSearchMode) {
      setSearchFilters(prev => ({
        ...prev,
        query: ""
      }));
    }
  };
  
  const cycleSortOption = () => {
    // Cycle through sort options
    const options: SortOption[] = ["alphabetical", "priceHighToLow", "priceLowToHigh", "default"];
    const currentIndex = options.indexOf(sortOption);
    const nextOption = options[(currentIndex + 1) % options.length];
    setSortOption(nextOption);
    setAppSortOption(nextOption);
  };
  
  const getSortIcon = () => {
    switch (sortOption) {
      case "alphabetical":
        return <ArrowDownAZ className="h-4 w-4" />;
      case "priceHighToLow":
        return <ArrowDownWideNarrow className="h-4 w-4" />;
      case "priceLowToHigh":
        return <ArrowDownNarrowWide className="h-4 w-4" />;
      default:
        return <ArrowDownAZ className="h-4 w-4 opacity-50" />;
    }
  };
  
  return (
    <div 
      className={cn(
        "function-panel fixed z-40 right-4 top-1/2 -translate-y-1/2 bg-background border rounded-lg shadow-md transition-all duration-300 flex flex-col gap-2 p-2",
        isCollapsed ? "w-12" : "w-52"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleCollapse}
        title={isCollapsed ? "Развернуть панель" : "Свернуть панель"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      
      {!isCollapsed && (
        <div className="space-y-2 w-full">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={toggleViewMode}
            title={viewMode === "grid" ? "Переключить в список" : "Переключить в плитки"}
          >
            {viewMode === "grid" ? (
              <>
                <List className="h-4 w-4 mr-2" />
                <span>Список</span>
              </>
            ) : (
              <>
                <Grid2X2 className="h-4 w-4 mr-2" />
                <span>Плитки</span>
              </>
            )}
          </Button>
          
          <Button
            variant={isSelectMode ? "default" : "outline"}
            className="w-full justify-start"
            onClick={toggleSelectMode}
            title={isSelectMode ? "Выйти из режима выбора" : "Выбрать несколько"}
          >
            <Check className="h-4 w-4 mr-2" />
            <span>Выбрать</span>
          </Button>
          
          <Button
            variant={isSearchMode ? "default" : "outline"}
            className="w-full justify-start"
            onClick={toggleSearchMode}
            title={isSearchMode ? "Скрыть поиск" : "Показать поиск"}
          >
            <Search className="h-4 w-4 mr-2" />
            <span>Поиск</span>
          </Button>
          
          <Button
            variant={sortOption !== "default" ? "default" : "outline"}
            className="w-full justify-start"
            onClick={cycleSortOption}
            title="Изменить сортировку"
          >
            {getSortIcon()}
            <span className="ml-2">Сортировка</span>
          </Button>
        </div>
      )}
      
      {isCollapsed && (
        <div className="space-y-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={toggleViewMode}
            title={viewMode === "grid" ? "Переключить в список" : "Переключить в плитки"}
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
          
          <Button
            variant={isSearchMode ? "default" : "outline"}
            size="icon"
            onClick={toggleSearchMode}
            title={isSearchMode ? "Скрыть поиск" : "Показать поиск"}
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <Button
            variant={sortOption !== "default" ? "default" : "outline"}
            size="icon"
            onClick={cycleSortOption}
            title="Изменить сортировку"
          >
            {getSortIcon()}
          </Button>
        </div>
      )}
    </div>
  );
}
