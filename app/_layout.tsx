import { useEffect } from "react";
import { LogBox } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CartProvider } from "@/contexts/CartContext";
import "./../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SFProTextLight: require("../assets/fonts/SF-Pro-Text-Light.otf"),
    SFProTextRegular: require("../assets/fonts/SF-Pro-Text-Regular.otf"),
    SFProTextMedium: require("../assets/fonts/SF-Pro-Text-Medium.otf"),
    SFProTextSemibold: require("../assets/fonts/SF-Pro-Text-Semibold.otf"),
    SFProTextBold: require("../assets/fonts/SF-Pro-Text-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  LogBox.ignoreAllLogs();

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
