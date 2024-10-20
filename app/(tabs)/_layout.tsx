import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CartItem {
  id: string;
  quantity: number;
}

export default function TabLayout() {
  const { cartData } = useCart();
  const { getColor } = useThemeColor();
  const { isRTL } = useLanguage();

  // Calculate the total quantity of items in the cart
  const totalQuantity =
    cartData?.items?.reduce(
      (acc: number, item: CartItem) => acc + item.quantity,
      0,
    ) || 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: getColor("text"),
        tabBarInactiveTintColor: getColor("text"),
        headerShown: false,
        tabBarLabelPosition: isRTL ? "beside-icon" : "below-icon",
        tabBarStyle: {
          backgroundColor: getColor("background"),
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(carts)"
        options={{
          title: "Carts",
          tabBarIcon: ({ color, focused }) => (
            <ThemedView>
              <TabBarIcon
                name={focused ? "basket" : "basket-outline"}
                color={color}
              />
              {totalQuantity > 0 && (
                <ThemedView
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -15,
                    backgroundColor: "red",
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                  }}
                >
                  <ThemedText
                    className="text-white text-[10px]"
                    style={{ lineHeight: 0 }}
                  >
                    {totalQuantity}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
