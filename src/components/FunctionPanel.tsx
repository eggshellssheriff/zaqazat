
import { useState } from "react";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Grid2X2,
  List,
  Clock,
  RotateCcw,
} from "lucide-react";

type ViewMode = "grid" | "list";
type SortOption = "dateNewest" | "dateOldest";

interface FunctionPanelProps {
  type: "products" | "orders";
  onViewModeChange?: (mode: ViewMode) => void;
}

export function FunctionPanel({ type, onViewModeChange }: FunctionPanelProps) {
  const { setSortOption: setAppSortOption, setSearchFilters } = useApp();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("dateNewest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSearchFilters({ query: value, type });
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
    } else {
      handleSearchChange("");
    }
  };

  const toggleViewMode = () => {
    const newViewMode = viewMode === "grid" ? "list" : "grid";
    setViewMode(newViewMode);
    if (onViewModeChange) {
      onViewModeChange(newViewMode);
    }
  };

  const toggleSortOption = () => {
    const newOption = sortOption === "dateNewest" ? "dateOldest" : "dateNewest";
    setSortOption(newOption);
    setAppSortOption(newOption);
  };

  return (
    <div className="flex items-center gap-2 mb-4 bg-card/40 backdrop-blur-sm p-2 rounded-md">
      <div className="flex items-center gap-2">
        {isSearchVisible ? (
          <div className="flex items-center gap-2">
            <Input
              id="search-input"
              type="search"
              placeholder="Поиск..."
              className="w-[200px] h-9"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="shrink-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="shrink-0"
            title="Поиск"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleViewMode}
          className="shrink-0"
          title={viewMode === "grid" ? "Список" : "Сетка"}
        >
          {viewMode === "grid" ? (
            <List className="h-4 w-4" />
          ) : (
            <Grid2X2 className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant={sortOption !== "dateNewest" ? "default" : "ghost"}
          size="icon"
          onClick={toggleSortOption}
          className="shrink-0"
          title={sortOption === "dateNewest" ? "От новых к старым" : "От старых к новым"}
        >
          {sortOption === "dateNewest" ? (
            <Clock className="h-4 w-4" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
