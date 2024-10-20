import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, Pressable } from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  createPaymentCollection,
  completeOrder,
} from "@/utils/api/completeCart";
import apiClient from "@/utils/api/apiClient";
import { useCart } from "@/contexts/CartContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

interface PaymentProviderProps {
  cart: any;
  setCart: (cart: any) => void;
  navigateToOrderConfirmation: (data: any) => void;
}

const PaymentProvider: React.FC<PaymentProviderProps> = ({
  cart,
  setCart,
  navigateToOrderConfirmation,
}) => {
  const { i18n } = useLanguage();
  const { refreshCart } = useCart();
  const [paymentProviders, setPaymentProviders] = useState<any[]>([]);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  useEffect(() => {
    if (!cart) return;
    const fetchPaymentProviders = async () => {
      try {
        const response = await apiClient.get(
          `/store/payment-providers?region_id=${cart.region_id}`
        );
        const providers = response.data.payment_providers || [];
        setPaymentProviders(providers);
        if (!selectedPaymentProvider && providers.length > 0) {
          setSelectedPaymentProvider(providers[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch payment providers:", error);
      }
    };
    fetchPaymentProviders();
  }, [cart]);

  const handleSelectProvider = async () => {
    if (!cart || !selectedPaymentProvider) {
      Alert.alert("Error", "Please select a payment provider.");
      return;
    }
    setLoading(true);
    try {
      // Create payment collection and select provider
      const paymentCollectionId = await createPaymentCollection(
        cart.id,
        selectedPaymentProvider
      );
      // Complete the order
      const orderSuccess = await completeOrder(cart.id);
      if (orderSuccess?.order?.id) {
        refreshCart();
        setCart({});
      }
      // Navigate to order confirmation page
      navigateToOrderConfirmation(orderSuccess?.order);
    } catch (error) {
      console.error("Payment selection failed:", error);
      Alert.alert("Error", "Failed to proceed with payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView className="p-5">
      <Pressable
        onPress={handleSelectProvider}
        disabled={!selectedPaymentProvider || loading}
        className="p-3 rounded-lg mt-4"
        style={{
          backgroundColor: Colors[colorScheme ?? "light"].primary,
        }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={Colors[colorScheme ?? "light"].secondary}
            className="mr-2"
          />
        ) : (
          <ThemedText
            className="text-center text-lg font-semibold"
            style={{
              color: Colors[colorScheme ?? "light"].secondary,
              fontFamily: "SFProTextSemibold",
            }}
          >
            {i18n.t("checkout.proceedToPayment")}
          </ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
};

export default PaymentProvider;
