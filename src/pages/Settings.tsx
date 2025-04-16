
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";

const Settings = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <Layout title="Настройки">
      <div className="space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-medium">Настройки интерфейса</h2>
          
          <div>
            <Label htmlFor="theme">Тема</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="h-20 flex flex-col gap-2"
                onClick={() => theme !== "light" && toggleTheme()}
              >
                <Sun className="h-6 w-6" />
                <span>Светлая</span>
              </Button>
              
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="h-20 flex flex-col gap-2"
                onClick={() => theme !== "dark" && toggleTheme()}
              >
                <Moon className="h-6 w-6" />
                <span>Темная</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
