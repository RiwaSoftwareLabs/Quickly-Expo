import { Stack } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfileLayout() {
  const { i18n } = useLanguage();
  return (
    <Stack>
      <Stack.Screen
        name="legal"
        options={{
          title: i18n.t("legal.title"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
