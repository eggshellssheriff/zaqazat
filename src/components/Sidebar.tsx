
import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/lib/context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { 
  Package, 
  ShoppingBag, 
  Settings, 
  Sun, 
  Moon,
  Database,
  FileText,
  Menu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SidebarToggle() {
  const { setSidebarOpen } = useApp();
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={(e) => {
        e.preventDefault(); // Prevent default to avoid page refresh
        setSidebarOpen(true);
      }}
      className="md:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { theme, toggleTheme, setSidebarOpen, sidebarOpen, products, orders, database } = useApp();
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent) => {
    // Only close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0">
          <div className="space-y-4 py-4">
            <div className="px-4 py-2">
              <h2 className="mb-2 text-lg font-semibold">Навигация</h2>
              <div className="space-y-1">
                <MobileNavItem
                  to="/products"
                  active={location.pathname === "/products"}
                  icon={<Package className="w-4 h-4 mr-2" />}
                  count={products.length}
                  onClick={handleLinkClick}
                >
                  Товары
                </MobileNavItem>
                <MobileNavItem
                  to="/orders"
                  active={location.pathname === "/orders"}
                  icon={<ShoppingBag className="w-4 h-4 mr-2" />}
                  count={orders.length}
                  onClick={handleLinkClick}
                >
                  Заказы
                </MobileNavItem>
                <MobileNavItem
                  to="/database"
                  active={location.pathname === "/database"}
                  icon={<Database className="w-4 h-4 mr-2" />}
                  count={database.length}
                  onClick={handleLinkClick}
                >
                  База данных
                </MobileNavItem>
                <MobileNavItem
                  to="/notes"
                  active={location.pathname === "/notes"}
                  icon={<FileText className="w-4 h-4 mr-2" />}
                  onClick={handleLinkClick}
                >
                  Заметки
                </MobileNavItem>
                <MobileNavItem
                  to="/settings"
                  active={location.pathname === "/settings"}
                  icon={<Settings className="w-4 h-4 mr-2" />}
                  onClick={handleLinkClick}
                >
                  Настройки
                </MobileNavItem>
              </div>
            </div>
            <div className="px-4 py-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={(e) => {
                  e.preventDefault(); // Prevent default
                  toggleTheme();
                }}
                size="sm"
              >
                {theme === 'light' 
                  ? <Moon className="w-4 h-4 mr-2" /> 
                  : <Sun className="w-4 h-4 mr-2" />
                }
                {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className={cn("pb-12 hidden md:block", className)}>
        <div className="space-y-4 py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Навигация
            </h2>
            <div className="space-y-1">
              <DesktopNavItem
                to="/products"
                active={location.pathname === "/products"}
                icon={<Package className="w-4 h-4 mr-2" />}
                count={products.length}
              >
                Товары
              </DesktopNavItem>
              <DesktopNavItem
                to="/orders"
                active={location.pathname === "/orders"}
                icon={<ShoppingBag className="w-4 h-4 mr-2" />}
                count={orders.length}
              >
                Заказы
              </DesktopNavItem>
              <DesktopNavItem
                to="/database"
                active={location.pathname === "/database"}
                icon={<Database className="w-4 h-4 mr-2" />}
                count={database.length}
              >
                База данных
              </DesktopNavItem>
              <DesktopNavItem
                to="/notes"
                active={location.pathname === "/notes"}
                icon={<FileText className="w-4 h-4 mr-2" />}
              >
                Заметки
              </DesktopNavItem>
              <DesktopNavItem
                to="/settings"
                active={location.pathname === "/settings"}
                icon={<Settings className="w-4 h-4 mr-2" />}
              >
                Настройки
              </DesktopNavItem>
            </div>
          </div>
          <div className="px-4 py-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={(e) => {
                e.preventDefault(); // Prevent default
                toggleTheme();
              }}
              size="sm"
            >
              {theme === 'light' 
                ? <Moon className="w-4 h-4 mr-2" /> 
                : <Sun className="w-4 h-4 mr-2" />
              }
              {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

interface NavItemProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  onClick?: (e: React.MouseEvent) => void;
}

function MobileNavItem({ to, active, children, icon, count, onClick }: NavItemProps) {
  return (
    <Link to={to} className="block" onClick={onClick}>
      <Button
        variant={active ? "default" : "ghost"}
        className="w-full justify-start"
        size="sm"
      >
        {icon}
        <span>{children}</span>
        {count !== undefined && (
          <Badge variant="outline" className="ml-auto">
            {count}
          </Badge>
        )}
      </Button>
    </Link>
  );
}

function DesktopNavItem({ to, active, children, icon, count }: NavItemProps) {
  return (
    <Link to={to}>
      <Button
        variant={active ? "default" : "ghost"}
        className="w-full justify-start"
        size="sm"
      >
        {icon}
        <span>{children}</span>
        {count !== undefined && (
          <Badge variant="outline" className="ml-auto">
            {count}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
