import { Stack, useRouter, useRootNavigationState } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderView from "@/components/views/HeaderView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeLayout() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { getColor } = useThemeColor();
  const { i18n } = useLanguage();

  const handleGoBack = () => {
    setTimeout(() => {
      const tabRoute = navigationState?.routes?.find(
        (route) => route.name === "(tabs)",
      );
      const homeRoute = tabRoute?.state?.routes?.find(
        (route) => route.name === "(home)",
      );
      const homeIndex = homeRoute?.state?.index;
      if (homeIndex === 1) {
        router.back();
      } else {
        router.push("/(home)");
      }
    }, 300);
  };

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
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
