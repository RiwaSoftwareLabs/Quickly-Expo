import React, { useRef } from "react";
import { Animated } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import NoImageView from "@/components/views/NoImageView";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Swipeable } from "react-native-gesture-handler";
import QuantityDropdown from "@/components/modals/QuantityDropdown";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const ITEM_HEIGHT = 80; // Define a constant for the item height

interface CartItemViewProps {
  item: any;
  onQuantityChange?: (id: string, quantity: number) => void;
  onDeleteItem?: (id: string) => void;
  isFromCart?: boolean;
}

const CartItemView: React.FC<CartItemViewProps> = ({
  item,
  onQuantityChange,
  onDeleteItem,
  isFromCart,
}) => {
  const { isRTL, i18n } = useLanguage();
  const { selectedCurrency } = useCurrency();
  const { getColor } = useThemeColor();
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });
    return (
      <ThemedView
        className="w-[78px] justify-center items-center"
        style={{
          backgroundColor: getColor("negative"),
          height: ITEM_HEIGHT,
        }}
      >
        <Animated.Text
          style={{
            color: getColor("light"),
            fontWeight: "600",
            transform: [{ translateX: trans }],
            fontSize: 14,
          }}
        >
          {i18n.t("cart.remove")}
        </Animated.Text>
      </ThemedView>
    );
  };

  const handleDelete = () => {
    if (onDeleteItem) {
      onDeleteItem(item.id);
    }
    swipeableRef.current?.close();
  };

  const content = (
    <ThemedView
      className="border p-2 mb-2 rounded-lg mx-3"
      style={{
        backgroundColor: getColor("background"),
        borderColor: getColor("border"),
        height: ITEM_HEIGHT,
      }}
    >
      <ThemedView className={`flex-row ${isRTL ? "flex-row-reverse" : ""}`}>
        {/* Image */}
        <ThemedView className="flex-shrink-0 w-16 h-16 mr-2">
          {item?.thumbnail ? (
            <Image
              className="w-full h-full rounded-lg"
              source={{ uri: item.thumbnail }}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={500}
            />
          ) : (
            <NoImageView />
          )}
        </ThemedView>
        {/* Content Wrapper */}
        <ThemedView className="flex-1 justify-between">
          {/* Title */}
          <ThemedText
            className="text-sm font-bold"
            style={{ color: getColor("text") }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.product_title}
          </ThemedText>
          {/* Variant and QuantityDropdown */}
          <ThemedView className="flex-row justify-between items-center">
            <ThemedText className="text-xs" style={{ color: getColor("text") }}>
              {i18n.t("cart.variant")}: {item.variant_title}
            </ThemedText>
            {isFromCart && (
              <QuantityDropdown
                quantity={item.quantity}
                onQuantityChange={(quantity) =>
                  onQuantityChange?.(item.id, quantity)
                }
              />
            )}
          </ThemedView>
          {/* Price */}
          <ThemedText
            className="text-sm font-bold"
            style={{ color: getColor("text") }}
          >
            {selectedCurrency}
            {(item.unit_price * item.quantity).toFixed(2)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  return isFromCart ? (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleDelete}
      rightThreshold={40}
    >
      {content}
    </Swipeable>
  ) : (
    content
  );
};

export default CartItemView;
