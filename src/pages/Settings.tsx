
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useApp } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Contrast, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const { theme, toggleTheme, settings, updateSettings } = useApp();

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
      </div>
    </Layout>
  );
};

export default Settings;
