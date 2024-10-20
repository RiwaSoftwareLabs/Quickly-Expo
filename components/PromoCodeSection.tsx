import React from "react";
import { TextInput, Pressable, FlatList } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";

interface PromoCodeSectionProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  onApply: (code: string) => void;
  onRemove: (code: string) => void;
  appliedCodes: string[];
  isLoading: boolean;
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
  promoCode,
  setPromoCode,
  onApply,
  onRemove,
  appliedCodes,
  isLoading,
}) => {
  const { i18n } = useLanguage();
  const { getColor } = useThemeColor();

  return (
    <ThemedView className="mt-4 mb-2  mx-3">
      <ThemedView className="flex-row mb-4">
        <TextInput
          className="flex-1 border border-gray-300 rounded-l-lg p-2"
          value={promoCode}
          onChangeText={setPromoCode}
          placeholder={i18n.t("checkout.enterPromoCode")}
        />
        <Pressable
          className={`rounded-r-lg px-4 py-2 justify-center`}
          style={{ backgroundColor: getColor("primary") }}
          onPress={() => onApply(promoCode)}
          disabled={isLoading}
        >
          <ThemedText
            className="font-semibold"
            style={{ color: getColor("background") }}
          >
            {isLoading ? i18n.t("common.loading") : i18n.t("checkout.apply")}
          </ThemedText>
        </Pressable>
      </ThemedView>
      {appliedCodes.length > 0 && (
        <ThemedView className="mt-4">
          <ThemedText
            className="font-semibold mb-2"
            style={{ color: getColor("text") }}
          >
            {i18n.t("checkout.appliedCodes")}:
          </ThemedText>
          <ThemedView className="flex-row flex-wrap">
            {appliedCodes.map((code) => (
              <ThemedView
                key={code}
                className="flex-row items-center bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2"
                style={{ backgroundColor: getColor("surface") }}
              >
                <ThemedText
                  className="mr-2"
                  style={{ color: getColor("discount") }}
                >
                  {code}
                </ThemedText>
                <Pressable onPress={() => onRemove(code)}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={getColor("text")}
                  />
                </Pressable>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default PromoCodeSection;
