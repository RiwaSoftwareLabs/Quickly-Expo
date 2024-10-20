import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ProductDetailProps {
  label: string;
  value?: string; // Optional value prop
}

const ProductDetail: React.FC<ProductDetailProps> = ({ label, value }) => {
  const { getColor } = useThemeColor();
  return (
    <ThemedView className="w-1/2 p-2">
      <ThemedText className="font-semibold" style={{ color: getColor("text") }}>
        {label}:
      </ThemedText>
      <ThemedText style={{ color: getColor("text") }}>
        {value ?? "-"}
      </ThemedText>
    </ThemedView>
  );
};

export default ProductDetail;
