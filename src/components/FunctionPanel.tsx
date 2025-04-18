
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Grid2X2,
  List,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide,
} from "lucide-react";

type ViewMode = "grid" | "list";
type SortOption = "default" | "priceLowToHigh" | "priceHighToLow";

export function FunctionPanel({ type }: { type: "products" | "orders" }) {
  const { setSortOption, setSearchFilters, viewMode, setViewMode } = useApp();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

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
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const cycleSortOption = () => {
    const options: SortOption[] = ["priceHighToLow", "priceLowToHigh", "default"];
    const currentIndex = options.indexOf(sortOption);
    const nextOption = options[(currentIndex + 1) % options.length];
    setSortOption(nextOption);
    setAppSortOption(nextOption);
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
          variant={sortOption !== "default" ? "default" : "ghost"}
          size="icon"
          onClick={cycleSortOption}
          className="shrink-0"
          title="Сортировка по цене"
        >
          {sortOption === "priceHighToLow" ? (
            <ArrowDownWideNarrow className="h-4 w-4" />
          ) : sortOption === "priceLowToHigh" ? (
            <ArrowDownNarrowWide className="h-4 w-4" />
          ) : (
            <ArrowDownWideNarrow className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </div>
    </div>
  );
}
