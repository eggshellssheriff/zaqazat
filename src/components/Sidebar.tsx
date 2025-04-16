
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { 
  Package,
  ShoppingCart,
  User,
  Settings,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
      
      <div className={`fixed top-0 left-0 z-50 h-full w-64 bg-card transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0`}>
        <div className="flex flex-col h-full border-r">
          <div className="p-4 flex items-center justify-between border-b">
            <h2 className="text-lg font-semibold">Учет товаров</h2>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={closeSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Link to="/" onClick={closeSidebar}>
              <Button
                variant={location.pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Package className="mr-2 h-4 w-4" />
                Товары
              </Button>
            </Link>
            
            <Link to="/orders" onClick={closeSidebar}>
              <Button
                variant={location.pathname === "/orders" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Заказы
              </Button>
            </Link>
            
            <Link to="/settings" onClick={closeSidebar}>
              <Button
                variant={location.pathname === "/settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Настройки
              </Button>
            </Link>
          </nav>
          
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Темная тема
                </>
              ) : (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Светлая тема
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function SidebarToggle() {
  const { setSidebarOpen } = useApp();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={() => setSidebarOpen(true)}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
