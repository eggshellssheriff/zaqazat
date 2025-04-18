
import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Phone, 
  Trash2, 
  Search, 
  ArrowUp, 
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PhoneEntryDetails = {
  phoneNumber: string;
  orders: Array<{
    id: string;
    date: string;
    productName: string;
    totalAmount: number;
    isDeleted?: boolean;
  }>;
};

const Database = () => {
  const { database, filteredDatabase, setSearchFilters, deletePhoneEntry } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PhoneEntryDetails | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Update search filters when search query changes
  useEffect(() => {
    setSearchFilters({ 
      type: "database", 
      query: searchQuery 
    });
  }, [searchQuery, setSearchFilters]);

  const handleScroll = () => {
    if (contentRef.current) {
      setShowScrollTop(contentRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => currentRef.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Reset filters when leaving the page
  useEffect(() => {
    return () => {
      // This will run when component unmounts
      setSearchFilters({ type: "database", query: "" });
    };
  }, [setSearchFilters]);

  // Calculate total amount for a phone entry
  const calculateTotal = (entry: PhoneEntryDetails) => {
    return entry.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  // Format date to local format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    });
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deletePhoneEntry(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  return (
    <Layout title="База данных" contentRef={contentRef}>
      <div className="flex flex-col gap-4 pb-20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-3">База данных</h1>
            <Badge variant="outline" className="mr-2">
              {database.length}
            </Badge>
          </div>
          <div className="relative w-64">
            <Input
              type="search"
              placeholder="Поиск по номеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-8"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {database.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">База данных пуста</h3>
            <p className="text-muted-foreground">
              Номера телефонов будут добавляться в базу данных при создании заказов
            </p>
          </div>
        ) : filteredDatabase.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Номера не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredDatabase.map((entry) => (
              <Card key={entry.phoneNumber} className="overflow-hidden hover:bg-accent/50 transition-colors">
                <div className="flex items-center p-3">
                  <Button
                    variant="ghost"
                    className="flex-1 flex items-center justify-start px-2 h-auto"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="font-medium">{entry.phoneNumber}</span>
                    <Badge variant="outline" className="ml-2">
                      {entry.orders.length}
                    </Badge>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(entry.phoneNumber)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="text-xs">Удалить</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Phone Entry Details Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {selectedEntry.phoneNumber}
              </DialogTitle>
              <DialogDescription>
                История заказов и общая сумма покупок
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Товар</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedEntry.orders.map((order) => (
                    <TableRow key={order.id} className={order.isDeleted ? "opacity-50" : ""}>
                      <TableCell className="font-medium">#{order.id.slice(-4)}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell className="text-right">{order.totalAmount.toLocaleString()} ₸</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter className="flex justify-between items-center mt-4">
              <div className="text-lg font-semibold">
                Итого: {calculateTotal(selectedEntry).toLocaleString()} ₸
              </div>
              <Button onClick={() => setSelectedEntry(null)}>Закрыть</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <Trash2 className="h-5 w-5 mr-2" />
              Удаление номера
            </DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить номер {deleteConfirm} из базы данных? 
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full shadow-md z-50"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </Layout>
  );
};

export default Database;
