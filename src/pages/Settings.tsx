
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Trash2, Contrast, DollarSign } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const { theme, toggleTheme, settings, updateSettings } = useApp();
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);

  const clearLocalStorage = () => {
    localStorage.clear();
    toast({
      title: "Данные очищены",
      description: "Все настройки и данные были сброшены. Перезагрузите страницу.",
    });
    setClearDataDialogOpen(false);
    setTimeout(() => window.location.reload(), 1500);
  };

  const toggleCurrencyConverter = () => {
    updateSettings({ showCurrencyConverter: !settings.showCurrencyConverter });
    toast({
      title: settings.showCurrencyConverter ? "Конвертер отключен" : "Конвертер включен",
      description: settings.showCurrencyConverter 
        ? "Конвертер валют больше не будет отображаться" 
        : "Конвертер валют будет доступен в разделе Заказы"
    });
  };

  return (
    <Layout title="Настройки">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Интерфейс</CardTitle>
            <CardDescription>Настройте внешний вид приложения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  <span>Тема</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {theme === "light" ? "Светлая тема" : "Тёмная тема"}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              >
                {theme === "light" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Конвертер валют</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Включить конвертер юаней в тенге
                </p>
              </div>
              <Switch
                checked={settings.showCurrencyConverter}
                onCheckedChange={toggleCurrencyConverter}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Данные</CardTitle>
            <CardDescription>Управление данными приложения</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span>Очистить все данные</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Удалит все товары, заказы и настройки. Это действие нельзя отменить.
                </p>
              </div>

              <AlertDialog open={clearDataDialogOpen} onOpenChange={setClearDataDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Очистить</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие удалит все товары, заказы и настройки приложения.
                      Данные будут удалены навсегда и их нельзя будет восстановить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={clearLocalStorage}>
                      Удалить всё
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
