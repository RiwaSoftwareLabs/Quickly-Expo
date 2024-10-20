import React from "react";
import { Modal, TouchableOpacity, FlatList, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { currencies } from "@/constants/Currencies";
import { useLanguage } from "@/contexts/LanguageContext";

interface CurrencyModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCurrency: string;
  onCurrencySelect: (currency: string) => void;
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({
  visible,
  onClose,
  selectedCurrency,
  onCurrencySelect,
}) => {
  const { i18n, isRTL } = useLanguage();
  const { getColor } = useThemeColor();

  const renderItem = ({ item }: { item: (typeof currencies)[0] }) => (
    <Pressable
      onPress={() => onCurrencySelect(item.code)}
      style={({ pressed }) => ({
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: getColor("border"),
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <ThemedText
        style={{
          color: getColor("primary"),
        }}
      >
        {isRTL
          ? `(${item.code}) ${item.label_ar}`
          : `${item.label_en} (${item.code})`}
      </ThemedText>
      {selectedCurrency === item.code && (
        <ThemedText
          style={{
            marginRight: isRTL ? "auto" : 0,
            marginLeft: isRTL ? 0 : "auto",
            color: getColor("primary"),
          }}
        >
          ✓
        </ThemedText>
      )}
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ThemedView className="flex-1 justify-end">
        <ThemedView
          className="rounded-t-lg p-4"
          style={{
            maxHeight: "95%",
            alignItems: isRTL ? "flex-end" : "flex-start",
          }}
        >
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: isRTL ? "right" : "left",
              width: "100%",
              color: getColor("primary"),
            }}
          >
            {i18n.t("profile.chooseCurrency")}
          </ThemedText>
          <FlatList
            data={currencies}
            renderItem={renderItem}
            keyExtractor={(item) => item.code}
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 10,
              width: "90%",
              backgroundColor: getColor("primary"),
              borderRadius: 8,
              padding: 12,
              alignSelf: "center", // Center the button horizontally
            }}
          >
            <ThemedText
              style={{
                textAlign: "center",
                fontSize: 16,
                color: getColor("secondary"),
              }}
            >
              {i18n.t("common.close")}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export default CurrencyModal;
