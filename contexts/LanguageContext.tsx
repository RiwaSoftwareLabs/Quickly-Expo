import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import * as SecureStore from "expo-secure-store";
import en from "../languages/english.json";
import ar from "../languages/arabic.json";

// Initialize i18n with translations
const i18n = new I18n({ en, ar });
const DEFAULT_LANGUAGE = getLocales()[0].languageCode ?? "en";

const LanguageContext = createContext({
  i18n,
  locale: DEFAULT_LANGUAGE,
  isRTL: DEFAULT_LANGUAGE === "ar",
  changeLanguage: async (lang: string) => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<string>(DEFAULT_LANGUAGE);
  const [isRTL, setIsRTL] = useState<boolean>(DEFAULT_LANGUAGE === "ar");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage =
          (await SecureStore.getItemAsync("appLanguage")) || DEFAULT_LANGUAGE;
        i18n.locale = storedLanguage; // Set locale in i18n immediately
        setLocale(storedLanguage); // Set locale in state
        setIsRTL(storedLanguage === "ar");
      } catch (error) {
        console.error("Error loading language settings: ", error);
      } finally {
        setIsLoading(false); // Mark language as loaded
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    try {
      i18n.locale = lang;
      setLocale(lang); // Update the state to trigger re-render
      setIsRTL(lang === "ar");
      await SecureStore.setItemAsync("appLanguage", lang);
    } catch (error) {
      console.error("Error changing language: ", error);
    }
  };

  // Prevent rendering until language is loaded
  if (isLoading) {
    return null; // You can return a loading spinner here if desired
  }

  return (
    <LanguageContext.Provider value={{ i18n, locale, isRTL, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
