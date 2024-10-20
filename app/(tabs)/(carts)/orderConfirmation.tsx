import React from "react";
import {
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

interface OrderItem {
  quantity: number;
  product_title: string;
  total: number;
  thumbnail: string;
}

interface DeliveryDetails {
  address: string;
  city: string;
  postalCode: string;
}

interface PaymentDetails {
  method: string;
  cardEnding: string;
}

interface OrderConfirmationParams {
  orderNumber: string;
  orderDate: string;
  email: string;
  items: OrderItem[];
  total: number;
  deliveryDetails: DeliveryDetails;
  paymentDetails: PaymentDetails;
}

const OrderConfirmation: React.FC = () => {
  const params = useLocalSearchParams() as unknown as OrderConfirmationParams;
  const router = useRouter();
  const {
    orderNumber = "-",
    orderDate = "-",
    email = "-",
    items = [],
    total = 0,
    deliveryDetails = { address: "-", city: "-", postalCode: "-" },
    paymentDetails = { method: "-", cardEnding: "-" },
  } = params || {};
  const orderItems = Array.isArray(items) ? items[0] : items;

  let parsedItems: OrderItem[] = [];

  if (typeof orderItems === "string") {
    try {
      parsedItems = JSON.parse(orderItems);
    } catch (error) {
      console.error("Error parsing orderItems:", error);
    }
  } else if (Array.isArray(orderItems)) {
    console.log("Received an array");
    parsedItems = orderItems;
  }

  const { selectedCurrency } = useCurrency();
  const { i18n } = useLanguage();

  const handleContinueShopping = () => {
    router.push({
      pathname: "/",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={20} // Adjust this offset as needed
    >
      <ThemedView className="flex-1 p-4 bg-white">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 50 }}
        >
          <ThemedText className="text-2xl font-bold mb-4 text-center">
            {i18n.t("order.title")}
          </ThemedText>
          <ThemedText className="text-lg font-semibold mt-4">
            {i18n.t("order.orderDetails")}
          </ThemedText>
          <ThemedText>
            {i18n.t("order.orderNumber")}: {orderNumber}
          </ThemedText>
          <ThemedText>
            {i18n.t("order.orderDate")}: {orderDate}
          </ThemedText>
          <ThemedText className="text-lg font-semibold mt-4">
            {i18n.t("order.itemsSummary")}
          </ThemedText>
          {Array.isArray(parsedItems) && parsedItems.length > 0 ? (
            parsedItems.map((item, index) => (
              <ThemedView
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                />
                <ThemedText>
                  {item.quantity}x {item.product_title || "-"} -{" "}
                  {selectedCurrency} {item.total || "-"}
                </ThemedText>
              </ThemedView>
            ))
          ) : (
            <ThemedText>-</ThemedText>
          )}
          <ThemedText className="font-bold mt-2">
            {i18n.t("order.total")}: {selectedCurrency} {total}
          </ThemedText>
          <ThemedText className="text-lg font-semibold mt-4">
            {i18n.t("order.deliveryDetails")}
          </ThemedText>
          <ThemedText>{deliveryDetails.address}</ThemedText>
          <ThemedText>
            {deliveryDetails.city}, {deliveryDetails.postalCode}
          </ThemedText>
          <ThemedText className="text-lg font-semibold mt-4">
            {i18n.t("order.paymentDetails")}
          </ThemedText>
          <ThemedText>{paymentDetails.method}</ThemedText>
          <ThemedText>
            {i18n.t("order.cardEnding")}: {paymentDetails.cardEnding}
          </ThemedText>
          {/* Display note about email confirmation */}
          <ThemedText className="mt-4 text-center">
            We have sent the order confirmation details to {email}
          </ThemedText>
        </ScrollView>
        <Pressable
          onPress={handleContinueShopping}
          className="bg-black p-4 mx-auto my-4 rounded w-3/4" // Center the button with margin and set width
        >
          <ThemedText className="text-white font-bold text-center">
            Continue Shopping
          </ThemedText>
        </Pressable>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default OrderConfirmation;
