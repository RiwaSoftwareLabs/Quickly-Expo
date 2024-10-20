import { Stack, useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderView from "@/components/views/HeaderView";

export default function HomeLayout() {
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
      <Stack.Screen name="cart" options={{ headerShown: false }} />
      <Stack.Screen
        name="checkout"
        options={{
          header: () => (
            <HeaderView
              title={i18n.t("checkout.title")}
              onPressBack={router.back}
              pressBackTitle={i18n.t("common.goBack")}
            />
          ),
        }}
      />
      <Stack.Screen name="orderConfirmation" options={{ headerShown: false }} />
    </Stack>
  );
}
