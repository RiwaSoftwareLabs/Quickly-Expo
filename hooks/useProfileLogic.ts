import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

export const useProfileLogic = () => {
  const { i18n, locale, changeLanguage } = useLanguage();
  const { selectedCurrency, changeCurrency } = useCurrency();
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLanguageChange = (lang: string) => {
    let newLanguage = lang === "ar" ? "en" : "ar";
    changeLanguage(newLanguage);
  };

  const handleCurrencyChange = (currencyCode: string) => {
    changeCurrency(currencyCode);
    setCurrencyModalVisible(false);
  };

  const handleRegister = (data: any) => {
    console.log("Registering:", data);
    setIsLoggedIn(true);
  };

  const handleLogin = (data: any) => {
    console.log("Login:", data);
    setIsLoggedIn(true);
  };

  const handlePasswordReset = (data: any) => {
    console.log("ResetPassword:", data);
    setIsLoggedIn(true);
  };

  return {
    isLoggedIn,
    locale,
    selectedCurrency,
    currencyModalVisible,
    handleLanguageChange,
    handleCurrencyChange,
    setCurrencyModalVisible,
    handleRegister,
    handleLogin,
    handlePasswordReset,
    i18n,
  };
};
