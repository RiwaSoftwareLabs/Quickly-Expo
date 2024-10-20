import React from "react";
import { Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CartBottomViewProps {
  subTotal: string;
  onCheckout: () => void;
}

export default function CartBottomView({
  subTotal,
  onCheckout,
}: CartBottomViewProps) {
  const { i18n, isRTL } = useLanguage();
  const { getColor } = useThemeColor();

  return (
    <ThemedView
      className={`p-4 flex-row items-center justify-between ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
      style={{ backgroundColor: getColor("background") }}
    >
      <ThemedText
        className="text-md"
        style={{ color: getColor("text"), fontFamily: "SFProTextSemibold" }}
      >
        {i18n.t("cart.subTotal")}: {subTotal}
      </ThemedText>
      <Pressable
        onPress={onCheckout}
        className="py-2 px-4 rounded-lg"
        style={{ backgroundColor: getColor("primary") }}
      >
        <ThemedText
          className="text-md"
          style={{
            color: getColor("secondary"),
            fontFamily: "SFProTextSemibold",
          }}
        >
          {i18n.t("cart.goCheckout")}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
