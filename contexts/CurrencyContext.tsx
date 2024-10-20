import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface CurrencyContextType {
  selectedCurrency: string;
  changeCurrency: (currency: string) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("QAR"); // Default currency

  useEffect(() => {
    const loadCurrency = async () => {
      const currency = await SecureStore.getItemAsync("selectedCurrency");
      if (currency) {
        setSelectedCurrency(currency);
      }
    };
    loadCurrency();
  }, []);

  const changeCurrency = async (currency: string) => {
    setSelectedCurrency(currency);
    await SecureStore.setItemAsync("selectedCurrency", currency);
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
