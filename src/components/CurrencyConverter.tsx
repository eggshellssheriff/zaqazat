
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CurrencyConverterProps {
  onClose: () => void;
}

export function CurrencyConverter({ onClose }: CurrencyConverterProps) {
  const [yuanAmount, setYuanAmount] = useState<string>("");
  const [tengeAmount, setTengeAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch exchange rate
  const fetchExchangeRate = async () => {
    setIsLoading(true);
    try {
      // Use a free currency API to get CNY to KZT conversion
      const response = await fetch('https://open.er-api.com/v6/latest/CNY');
      const data = await response.json();
      
      if (data && data.rates && data.rates.KZT) {
        const rate = data.rates.KZT;
        setExchangeRate(rate);
        setLastUpdated(new Date());
        localStorage.setItem('yuanToTengeRate', String(rate));
        localStorage.setItem('yuanToTengeRateUpdated', new Date().toISOString());
      } else {
        throw new Error('Failed to get currency data');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить курс валюты. Используется сохраненный курс.",
        variant: "destructive",
      });
      
      // Use fallback rate if available
      const savedRate = localStorage.getItem('yuanToTengeRate');
      if (savedRate) {
        setExchangeRate(parseFloat(savedRate));
        const savedDate = localStorage.getItem('yuanToTengeRateUpdated');
        if (savedDate) {
          setLastUpdated(new Date(savedDate));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate conversion
  const convertYuanToTenge = (yuan: string) => {
    if (!yuan || !exchangeRate) {
      setTengeAmount("");
      return;
    }
    
    const yuanValue = parseFloat(yuan);
    if (isNaN(yuanValue)) {
      setTengeAmount("");
      return;
    }
    
    const tengeValue = yuanValue * exchangeRate;
    setTengeAmount(tengeValue.toFixed(0));
  };
  
  const convertTengeToYuan = (tenge: string) => {
    if (!tenge || !exchangeRate) {
      setYuanAmount("");
      return;
    }
    
    const tengeValue = parseFloat(tenge);
    if (isNaN(tengeValue)) {
      setYuanAmount("");
      return;
    }
    
    const yuanValue = tengeValue / exchangeRate;
    setYuanAmount(yuanValue.toFixed(2));
  };

  // Initialize
  useEffect(() => {
    // First try to use saved rate to avoid unnecessary API calls
    const savedRate = localStorage.getItem('yuanToTengeRate');
    const savedDate = localStorage.getItem('yuanToTengeRateUpdated');
    
    if (savedRate && savedDate) {
      const parsedRate = parseFloat(savedRate);
      const parsedDate = new Date(savedDate);
      
      // Check if the rate is less than 24 hours old
      const isRecent = (new Date().getTime() - parsedDate.getTime()) < 24 * 60 * 60 * 1000;
      
      if (isRecent) {
        setExchangeRate(parsedRate);
        setLastUpdated(parsedDate);
      } else {
        // Rate is too old, fetch new one
        fetchExchangeRate();
      }
    } else {
      // No saved rate, fetch from API
      fetchExchangeRate();
    }
  }, []);

  // Format the last updated date
  const formattedLastUpdated = lastUpdated ? 
    new Intl.DateTimeFormat('ru', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(lastUpdated) : '';

  return (
    <Card className="currency-converter">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Конвертер валют</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="yuan">Юань (CNY)</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              disabled={isLoading}
              onClick={fetchExchangeRate}
              title="Обновить курс"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <Input
            id="yuan"
            type="number"
            value={yuanAmount}
            onChange={(e) => {
              setYuanAmount(e.target.value);
              convertYuanToTenge(e.target.value);
            }}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tenge">Тенге (KZT)</Label>
          <Input
            id="tenge"
            type="number"
            value={tengeAmount}
            onChange={(e) => {
              setTengeAmount(e.target.value);
              convertTengeToYuan(e.target.value);
            }}
            placeholder="0"
            min="0"
            step="1"
          />
        </div>
        
        {exchangeRate && (
          <div className="text-xs text-center text-muted-foreground">
            <p>Курс: 1 CNY = {exchangeRate.toFixed(2)} KZT</p>
            {formattedLastUpdated && (
              <p>Обновлено: {formattedLastUpdated}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
