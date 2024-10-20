import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const { i18n, isRTL } = useLanguage();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerTintColor: Colors[colorScheme ?? "light"].text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="news"
        options={{
          title: i18n.t("news.title"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: i18n.t("news.detailsTitle"),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
