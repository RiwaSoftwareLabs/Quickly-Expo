import { Stack, useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderView from "@/components/views/HeaderView";

export default function ProfileLayout() {
  const { getColor } = useThemeColor();
  const { i18n } = useLanguage();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: getColor("background"),
        },
        headerTintColor: getColor("text"),
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="(legal)"
        options={{
          header: () => (
            <HeaderView
              title={i18n.t("legal.title")}
              onPressBack={router.back}
              pressBackTitle={i18n.t("common.goBack")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          header: () => (
            <HeaderView
              title={i18n.t("faq.title")}
              onPressBack={router.back}
              pressBackTitle={i18n.t("common.goBack")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          header: () => (
            <HeaderView
              title={i18n.t("about.title")}
              onPressBack={router.back}
              pressBackTitle={i18n.t("common.goBack")}
            />
          ),
        }}
      />
    </Stack>
  );
}
