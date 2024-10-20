/**
 * This hook provides functionality for managing and toggling the app's appearance (light/dark mode).
 * It can be used to get the current theme color and toggle between light and dark modes.
 */

import { useState, useEffect, useCallback } from "react";
import {
  useColorScheme as useNativeColorScheme,
  Appearance,
} from "react-native";
import { Colors } from "@/constants/Colors";

export function useThemeColor() {
  const nativeColorScheme = useNativeColorScheme();
  const [theme, setTheme] = useState(nativeColorScheme || "light");

  const handleAppearanceChange = useCallback(
    ({ colorScheme }: Appearance.AppearancePreferences) => {
      setTheme(colorScheme || "light");
    },
    [],
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(handleAppearanceChange);
    return () => {
      subscription.remove();
    };
  }, [handleAppearanceChange]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    Appearance.setColorScheme(newTheme);
  }, [theme]);

  const getColor = useCallback(
    (colorName: keyof typeof Colors.light & keyof typeof Colors.dark) => {
      return Colors[theme][colorName];
    },
    [theme],
  );

  return { theme, toggleTheme, getColor };
}
