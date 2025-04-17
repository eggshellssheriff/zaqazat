
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
  
  const { setSortOption: setAppSortOption } = useApp();
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
    // Here you would update app context or state to show/hide search filters
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
        "function-panel",
        isCollapsed && "function-panel-collapsed"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="function-panel-button"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        className="function-panel-button"
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
        className="function-panel-button"
        onClick={toggleSelectMode}
        title={isSelectMode ? "Выйти из режима выбора" : "Выбрать несколько"}
      >
        <Check className="h-4 w-4" />
      </Button>
      
      <Button
        variant={isSearchMode ? "default" : "outline"}
        className="function-panel-button"
        onClick={toggleSearchMode}
        title={isSearchMode ? "Скрыть фильтры" : "Показать фильтры"}
      >
        <Search className="h-4 w-4" />
      </Button>
      
      <Button
        variant={sortOption !== "default" ? "default" : "outline"}
        className="function-panel-button"
        onClick={cycleSortOption}
        title="Изменить сортировку"
      >
        {getSortIcon()}
      </Button>
    </div>
  );
}
