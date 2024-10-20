import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CartBottomView from "@/components/views/CartBottomView";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  fetchCartData,
  updateItemLine,
  deleteItemLine,
} from "@/utils/api/cartApi";
import { useCart } from "@/contexts/CartContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import CartItemView from "@/components/views/CartItemView";
import PageTitle from "@/components/views/PageTitleView";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Main CartScreen component
export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { i18n } = useLanguage();
  const { selectedCurrency } = useCurrency();
  const { getColor } = useThemeColor();
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { refreshCart } = useCart();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCartData();
      setCartData(data);
    } catch (error) {
      console.error("Error loading cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  // Function to handle quantity selection
  const handleQuantitySelect = async (id: string, qty: number) => {
    try {
      console.log(`Updating quantity for item ${id} to ${qty}`);
      const updatedCartData = await updateItemLine(id, qty, {});
      setCartData(updatedCartData);
      refreshCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Handle checkout action
  const handleCheckout = () => {
    navigation.navigate("(carts)", { screen: "checkout" });
  };

  // Handle delete item
  const handleDeleteItem = async (id: string) => {
    try {
      const updatedCart = await deleteItemLine(id);
      setCartData(updatedCart);
      refreshCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <CartItemView
      item={item}
      onQuantityChange={handleQuantitySelect}
      onDeleteItem={handleDeleteItem}
      isFromCart={true}
    />
  );

  // If cartData is empty, show the message and explore button
  if (!loading && (!cartData || cartData?.items?.length < 1)) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: getColor("background"),
        }}
      >
        <ThemedText
          className="text-xl font-medium mb-4"
          style={{
            color: getColor("text"),
          }}
        >
          You don't have anything in your cart.
        </ThemedText>
        <Pressable
          onPress={() => navigation.navigate("(home)")}
          style={{
            backgroundColor: getColor("primary"),
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
            borderRadius: 5,
          }}
        >
          <ThemedText
            className="text-md"
            style={{
              color: getColor("secondary"),
            }}
          >
            Explore products
          </ThemedText>
        </Pressable>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ThemedView className="flex-1 relative">
            {loading ? (
              <ThemedView className="flex-1 justify-center items-center">
                <ActivityIndicator
                  size="large"
                  color={getColor("text")}
                  style={{ marginTop: 20 }}
                />
              </ThemedView>
            ) : (
              <>
                <FlatList
                  data={cartData?.items}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding at the bottom
                  className="flex-1 pt-14"
                  ListHeaderComponent={
                    <PageTitle title={i18n.t("cart.title")} />
                  }
                />
                <ThemedView
                  className="absolute bottom-0 left-0 right-0"
                  style={{ backgroundColor: getColor("background") }}
                >
                  {!loading && (
                    <CartBottomView
                      subTotal={`${selectedCurrency} ${cartData?.item_subtotal || 0}`}
                      onCheckout={handleCheckout}
                    />
                  )}
                </ThemedView>
              </>
            )}
          </ThemedView>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    );
  }
}
