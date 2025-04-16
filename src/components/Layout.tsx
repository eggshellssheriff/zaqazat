
import { Sidebar, SidebarToggle } from "./Sidebar";
import { useApp } from "@/lib/context";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-card p-4 shadow-sm border-b flex items-center">
          <SidebarToggle />
          <h1 className="text-xl font-semibold ml-2">{title}</h1>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
