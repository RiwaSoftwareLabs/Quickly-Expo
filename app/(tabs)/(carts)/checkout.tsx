import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { fetchCartData } from "@/utils/api/cartApi";
import PaymentProvider from "@/components/PaymentProvider";
import PromoCodeSection from "@/components/PromoCodeSection";
import { useThemeColor } from "@/hooks/useThemeColor";
import CartItemView from "@/components/views/CartItemView";
import PageTitle from "@/components/views/PageTitleView";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CheckoutScreen() {
  const router = useRouter();
  const { i18n } = useLanguage(); // Get language context
  const { selectedCurrency } = useCurrency();
  const { getColor } = useThemeColor();
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false); // State for button loading
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCartData();
      if (!data || data.items.length === 0) {
        router.replace("/cart");
      }
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

  const navigateToOrderConfirmation = async (order: any) => {
    router.push({
      pathname: "/orderConfirmation",
      params: {
        orderNumber: order?.id,
        orderDate: order?.created_at,
        items: JSON.stringify(order?.items),
        total: order?.total,
        deliveryDetails: order?.total,
        paymentDetails: order?.shipping_address,
        email: order?.email,
      },
    });
  };

  const handlePromoCode = async (code: string, action: "add" | "remove") => {
    setButtonLoading(true);
    try {
      let updatedCart;
      if (action === "add") {
        // TODO: Replace with actual API call to validate and apply promo code
        // updatedCart = await applyPromoCode(cartData.id, code);
      } else {
        // TODO: Replace with actual API call to remove promo code
        // updatedCart = await removePromoCode(cartData.id, code);
      }

      // Update cart data with the response from the API
      // setCartData(updatedCart);
    } catch (error) {
      console.error(
        `Error ${action === "add" ? "applying" : "removing"} promo code:`,
        error
      );
      alert(`Error ${action === "add" ? "applying" : "removing"} promo code`);
    } finally {
      setButtonLoading(false);
    }
  };

  // If cartData is empty, show the message and explore button
  if (!loading && (!cartData || cartData?.items?.length < 1)) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center"
      >
        <ThemedText className="text-xl font-medium text-gray-600 mb-4">
          Your cart is empty.
        </ThemedText>
      </KeyboardAvoidingView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView className="flex-1 pt-5">
            <PageTitle title={i18n.t("checkout.itemSummary")} size="sm" />
            {cartData?.items?.map((item: any) => (
              <CartItemView key={item.id} item={item} />
            ))}
            <PromoCodeSection
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              onApply={(code) => handlePromoCode(code, "add")}
              onRemove={(code: string) => handlePromoCode(code, "remove")}
              appliedCodes={
                cartData?.promotions?.map((promo: any) => promo.code) || []
              }
              isLoading={buttonLoading}
            />

            <ThemedView
              className="mt-4 p-4 mx-3 rounded-lg"
              style={{ backgroundColor: getColor("surface") }}
            >
              <ThemedText
                className="text-lg font-semibold mb-2"
                style={{ color: getColor("text") }}
              >
                {i18n.t("checkout.summary")}
              </ThemedText>
              <ThemedView
                className="flex-row justify-between mb-2"
                style={{ backgroundColor: getColor("surface") }}
              >
                <ThemedText
                  style={{
                    color: getColor("text"),
                  }}
                >
                  {i18n.t("checkout.subtotal")}
                </ThemedText>
                <ThemedText
                  style={{
                    color: getColor("text"),
                  }}
                >
                  {selectedCurrency} {cartData?.subtotal || 0}
                </ThemedText>
              </ThemedView>
              {cartData?.promotions && cartData.promotions.length > 0 && (
                <ThemedView
                  className="flex-row justify-between mb-2"
                  style={{ backgroundColor: getColor("surface") }}
                >
                  <ThemedView
                    className="flex-row items-center"
                    style={{ backgroundColor: getColor("surface") }}
                  >
                    <ThemedText
                      style={{
                        color: getColor("text"),
                      }}
                    >
                      {i18n.t("checkout.discount")}
                    </ThemedText>
                    <ThemedText
                      className="ml-1 text-xs"
                      style={{
                        color: getColor("text"),
                      }}
                    >
                      {cartData.promotions
                        .map((promo: any) => promo.code)
                        .join(", ")}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText
                    style={{
                      color: getColor("discount"),
                    }}
                  >
                    - {selectedCurrency}{" "}
                    {cartData.promotions.reduce(
                      (total: number, promo: any) =>
                        total + promo.application_method.value,
                      0
                    )}
                  </ThemedText>
                </ThemedView>
              )}
              <ThemedView
                className="flex-row justify-between mt-2 pt-2 border-t"
                style={{
                  borderColor: getColor("border"),
                  backgroundColor: getColor("surface"),
                }}
              >
                <ThemedText
                  className="text-lg font-bold"
                  style={{ color: getColor("text") }}
                >
                  {i18n.t("checkout.total")}
                </ThemedText>
                <ThemedText
                  className="text-lg font-bold"
                  style={{ color: getColor("text") }}
                >
                  {selectedCurrency} {cartData?.total || 0}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <PaymentProvider
              cart={cartData}
              setCart={setCartData}
              navigateToOrderConfirmation={navigateToOrderConfirmation}
            />
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
