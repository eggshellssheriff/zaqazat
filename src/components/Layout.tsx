
import { Sidebar, SidebarToggle } from "./Sidebar";
import { useApp } from "@/lib/context";
import { RefObject } from "react";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  contentRef?: RefObject<HTMLDivElement>;
}

export function Layout({ children, title, contentRef }: LayoutProps) {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen">
        <header className="bg-background/95 backdrop-blur-sm p-4 shadow-sm border-b flex items-center sticky top-0 z-20">
          <SidebarToggle />
          <h1 className="text-xl font-semibold ml-2">{title}</h1>
        </header>
        
        <main 
          ref={contentRef} 
          className="flex-1 p-4 md:p-6 overflow-y-auto relative"
        >
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
