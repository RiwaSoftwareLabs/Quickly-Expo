import React, { useState } from "react";
import { Pressable, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import NoImageView from "@/components/views/NoImageView";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { addItemLine } from "@/utils/api/cartApi";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface CalculatedPrice {
  raw_original_amount: {
    value: number;
    currency: string;
  };
}

interface Variant {
  allow_backorder: boolean;
  barcode: string | null;
  calculated_price: CalculatedPrice;
  created_at: string;
  deleted_at: string | null;
  ean: string | null;
  hs_code: string | null;
  id: string;
  manage_inventory: boolean;
  material: string | null;
  metadata: object | null;
  mid_code: string | null;
  product_id: string;
  sku: string;
  title: string;
  upc: string | null;
  updated_at: string;
  variant_rank: number;
  weight: number | null;
  width: number | null;
  length: number | null;
  height: number | null;
  origin_country: string | null;
  readyToAddToCart: boolean;
  inventory_quantity: number | 0;
}
interface HomeItemViewProps {
  item: {
    id: string;
    title: string;
    thumbnail: string;
    variants: Variant[];
  };
  onPress: () => void;
  selectedCurrency: string;
}

const HomeItemView: React.FC<HomeItemViewProps> = React.memo(
  ({ item, onPress, selectedCurrency }) => {
    const { getColor } = useThemeColor();
    const { i18n } = useLanguage();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { setCartData, refreshCart } = useCart();

    const handleAddToCart = async () => {
      setIsAddingToCart(true);
      try {
        const updatedCart = await addItemLine(item.variants[0].id, 1, {});
        setCartData(updatedCart);
        refreshCart();
      } catch (error) {
        console.error("Error adding item to cart:", error);
      } finally {
        setIsAddingToCart(false);
      }
    };

    return (
      <Pressable onPress={onPress}>
        <ThemedView
          className="flex-row rounded-lg p-4 mb-4 mx-4"
          style={{
            backgroundColor: getColor("background"),
            borderColor: getColor("border"),
            borderWidth: 1,
          }}
        >
          <ThemedView className="w-1/3 mr-4">
            {item?.thumbnail ? (
              <Image
                className="w-full h-32 rounded-lg"
                source={{ uri: item.thumbnail }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={500}
              />
            ) : (
              <NoImageView />
            )}
          </ThemedView>
          <ThemedView className="w-2/3 justify-between">
            <ThemedText
              className="text-lg font-bold"
              style={{ color: getColor("text") }}
            >
              {item.title}
            </ThemedText>
            <ThemedText
              className="text-base mb-2"
              style={{
                color: getColor("text"),
                fontFamily: "SFProTextSemibold",
              }}
            >
              {selectedCurrency}{" "}
              {item.variants[0]?.calculated_price?.raw_original_amount?.value
                ? item.variants[0].calculated_price.raw_original_amount.value
                : "N/A"}
            </ThemedText>
            <Pressable
              onPress={handleAddToCart}
              disabled={isAddingToCart}
              style={({ pressed }) => [
                {
                  backgroundColor: getColor("primary"),
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 12,
                  opacity: pressed ? 0.7 : 1,
                  height: 40,
                },
              ]}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color={getColor("secondary")} />
              ) : (
                <ThemedText
                  className="text-base font-semibold"
                  style={{
                    color: getColor("secondary"),
                    fontFamily: "SFProTextSemibold",
                  }}
                >
                  {i18n.t("cart.add")}
                </ThemedText>
              )}
            </Pressable>
          </ThemedView>
        </ThemedView>
      </Pressable>
    );
  }
);

export default HomeItemView;
