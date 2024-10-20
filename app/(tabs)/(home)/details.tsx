import React, { useState, useEffect, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import NoImageView from "@/components/views/NoImageView";
import ProductDetailView from "@/components/views/ProductDetailView";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AntDesign } from "@expo/vector-icons";
import { addItemLine } from "@/utils/api/cartApi";
import { useCart } from "@/contexts/CartContext";
import { fetchProductDetails } from "@/utils/api/productApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

// Blurhash placeholder
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

// TypeScript Interfaces
interface Price {
  original_amount: string;
}

interface Value {
  id: string;
  value: string;
  option_id: string;
  metadata: any | null;
  created_at: string;
  updated_at: string;
  deleted_at: any | null;
}

interface Option {
  id: string;
  title: string;
  product_id: string;
  metadata: any | null;
  created_at: string;
  updated_at: string;
  deleted_at: any | null;
  values: Value[];
}

interface OptionOuter {
  id: string;
  value: string;
  option_id: string;
  option: Option[];
  metadata: any | null;
}

interface Variant {
  allow_backorder: boolean;
  barcode: string | null;
  calculated_price: Price;
  created_at: string;
  deleted_at: string | null;
  ean: string | null;
  hs_code: string | null;
  id: string;
  manage_inventory: boolean;
  material: string | null;
  metadata: object | null;
  mid_code: string | null;
  options: OptionOuter[];
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
  inventory_quantity: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  variants: Variant[];
  options: Option[];
  weight: number | null;
  width: number | null;
  length: number | null;
  height: number | null;
  origin_country: string | null;
}

export default function DetailsScreen() {
  const { selectedCurrency } = useCurrency();
  const { refreshCart } = useCart();
  const { id } = useLocalSearchParams();
  const { i18n } = useLanguage();
  const { getColor } = useThemeColor();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [isInfoVisible, setInfoVisible] = useState<boolean>(false);
  const [isShippingVisible, setShippingVisible] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    undefined
  );
  const [product, setProduct] = useState<Product | null>(null);

  // Fetch product details when 'id' changes
  useEffect(() => {
    const getProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData: Product = await fetchProductDetails(id as string);
        setProduct(productData);
      } catch (error) {
        const errorMessage =
          (error as Error).message || "Error fetching product details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProductDetails();
    }
  }, [id]);

  // Find matching variant based on selected options using useMemo
  const findMatchingVariant = useMemo<Variant | undefined>(() => {
    if (!product) return undefined;
    return product.variants.find((variant) =>
      variant.options.every((option, index) => {
        const optionTitle = product.options[index]?.title;
        const selectedValue = selectedOptions[optionTitle || ""] || "";
        return option.value === selectedValue;
      })
    );
  }, [product, selectedOptions]);

  // Update selectedVariant whenever selectedOptions or product changes
  useEffect(() => {
    if (!product) {
      setSelectedVariant(undefined);
      return;
    }

    const matchingVariant = findMatchingVariant;
    const baseVariant = matchingVariant || product.variants[0];

    setSelectedVariant({
      ...baseVariant,
      readyToAddToCart:
        !!matchingVariant || product.options[0]?.title === "Default option",
      weight: product.weight,
      width: product.width,
      length: product.length,
      height: product.height,
      origin_country: product.origin_country,
    });
  }, [findMatchingVariant, product]);

  // Handle option selection
  const handleOptionSelect = (optionTitle: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionTitle]: value }));
  };

  // Toggle visibility of sections
  const toggleInfoVisibility = () => setInfoVisible((prev) => !prev);
  const toggleShippingVisibility = () => setShippingVisible((prev) => !prev);

  // Handle adding item to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setLoading(true);
    try {
      await addItemLine(selectedVariant.id, 1, {});
      refreshCart();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !product) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </ThemedView>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemedView className="flex-1 items-center justify-center px-4">
        <ThemedText className="text-red-500 text-center">{error}</ThemedText>
      </ThemedView>
    );
  }

  // Product not found
  if (!product) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText>{i18n.t("common.notFound")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: getColor("background") }}
    >
      <ThemedView className="flex-1 items-start p-4">
        {/* Product Image */}
        {product.thumbnail ? (
          <Image
            className="w-full h-72 rounded-lg"
            source={{ uri: product.thumbnail }}
            placeholder={{ blurhash }}
            contentFit="contain"
            transition={500}
          />
        ) : (
          <NoImageView />
        )}

        {/* Title */}
        <ThemedText
          className="text-xl font-bold mt-4 text-left"
          style={{ color: getColor("text") }}
        >
          {product.title}
        </ThemedText>

        {/* Description */}
        <ThemedText
          className="text-gray-600 text-left my-2"
          style={{ color: getColor("text") }}
        >
          {product.description}
        </ThemedText>

        {/* Product Information Section */}
        <CollapsibleSection
          title={i18n.t("home.productInformation")}
          isVisible={isInfoVisible}
          toggleVisibility={toggleInfoVisibility}
        >
          {selectedVariant ? (
            <ProductDetails variant={selectedVariant} />
          ) : (
            <ThemedText style={{ color: getColor("text") }}>
              {i18n.t("common.notFound")}
            </ThemedText>
          )}
        </CollapsibleSection>

        {/* Shipping & Returns Section */}
        <CollapsibleSection
          title={i18n.t("home.shippingReturns")}
          isVisible={isShippingVisible}
          toggleVisibility={toggleShippingVisibility}
        >
          <ThemedView className="mt-4">
            <InfoItem text="Fast delivery: Your package will arrive in 3-5 business days at your pick-up location or in the comfort of your home." />
            <InfoItem text="Simple exchanges: Is the fit not quite right? No worries - we'll exchange your product for a new one." />
            <InfoItem text="Easy returns: Just return your product and we'll refund your money. No questions asked – we'll do our best to make sure your return is hassle-free." />
          </ThemedView>
        </CollapsibleSection>

        {/* Option Selectors */}
        {product.options
          .filter((option) => option.title !== "Default option")
          .map((option) => (
            <OptionSelector
              key={option.id}
              option={option}
              selectedOptions={selectedOptions}
              handleOptionSelect={handleOptionSelect}
            />
          ))}

        {/* Price */}
        {selectedVariant && (
          <>
            <ThemedText
              className="font-semibold mt-2"
              style={{ color: getColor("text") }}
            >
              From
            </ThemedText>
            <ThemedText
              className="font-bold text-lg"
              style={{ color: getColor("text") }}
            >
              {`${selectedCurrency} ${selectedVariant.calculated_price.original_amount}`}
            </ThemedText>
          </>
        )}

        {/* Add to Cart Button */}
        <Pressable
          className={`py-3 rounded-lg mt-4 w-full items-center`}
          style={{
            backgroundColor:
              selectedVariant?.readyToAddToCart &&
              (selectedVariant.inventory_quantity > 0 ||
                selectedVariant.inventory_quantity === undefined)
                ? getColor("primary")
                : getColor("disabled"),
          }}
          onPress={
            selectedVariant?.readyToAddToCart &&
            !loading &&
            (selectedVariant.inventory_quantity > 0 ||
              selectedVariant.inventory_quantity === undefined)
              ? handleAddToCart
              : undefined
          }
          disabled={
            loading ||
            (selectedVariant?.inventory_quantity !== undefined &&
              selectedVariant.inventory_quantity < 1) ||
            !selectedVariant?.readyToAddToCart
          }
        >
          {loading ? (
            <ActivityIndicator color={getColor("secondary")} />
          ) : (
            <ThemedText
              className="text-center text-lg font-semibold"
              style={{ color: getColor("secondary") }}
            >
              {!selectedVariant?.readyToAddToCart
                ? "Select Variant"
                : selectedVariant.inventory_quantity === 0
                  ? "Out of stock"
                  : "Add to Cart"}
            </ThemedText>
          )}
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

interface CollapsibleSectionProps {
  title: string;
  isVisible: boolean;
  toggleVisibility: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  isVisible,
  toggleVisibility,
  children,
}: CollapsibleSectionProps) {
  const { getColor } = useThemeColor();
  return (
    <ThemedView
      className="w-full"
      style={{ backgroundColor: getColor("background") }}
    >
      <Pressable
        onPress={toggleVisibility}
        className="p-3 rounded-lg mt-4 border-t border-b flex-row items-center justify-between"
        style={{
          borderColor: getColor("border"),
        }}
      >
        <ThemedText
          className="text-lg font-semibold"
          style={{ color: getColor("text") }}
        >
          {title}
        </ThemedText>
        <AntDesign name={isVisible ? "up" : "down"} size={16} color="black" />
      </Pressable>
      {isVisible && (
        <ThemedView
          className="p-4 rounded-lg mt-2"
          style={{ backgroundColor: getColor("background") }}
        >
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}

// ProductDetails Component
interface ProductDetailsProps {
  variant: Variant;
}

function ProductDetails({ variant }: ProductDetailsProps) {
  const { getColor } = useThemeColor();
  return (
    <ThemedView
      className="flex-row flex-wrap justify-between"
      style={{ backgroundColor: getColor("background") }}
    >
      <ProductDetailView label="Material" value={variant.material || "-"} />
      <ProductDetailView
        label="Weight"
        value={variant.weight ? `${variant.weight} kg` : "-"}
      />
      <ProductDetailView
        label="Country of Origin"
        value={variant.origin_country || "-"}
      />
      <ProductDetailView
        label="Dimensions"
        value={
          variant.length && variant.width && variant.height
            ? `${variant.length}L x ${variant.width}W x ${variant.height}H`
            : "-"
        }
      />
      <ProductDetailView label="SKU" value={variant.sku || "-"} />
    </ThemedView>
  );
}

// OptionSelector Component
interface OptionSelectorProps {
  option: Option;
  selectedOptions: { [key: string]: string };
  handleOptionSelect: (optionTitle: string, value: string) => void;
}

function OptionSelector({
  option,
  selectedOptions,
  handleOptionSelect,
}: OptionSelectorProps) {
  return (
    <ThemedView className="my-2 w-full">
      <ThemedText className="font-semibold mb-2">{option.title}</ThemedText>
      <ThemedView className="flex-row flex-wrap">
        {option.values.map((value) => {
          const isSelected = selectedOptions[option.title] === value.value;
          return (
            <Pressable
              key={value.id}
              className={`py-2 px-4 mr-2 mb-2 rounded-lg ${
                isSelected ? "bg-black" : "bg-gray-200"
              }`}
              onPress={() => handleOptionSelect(option.title, value.value)}
            >
              <ThemedText
                className={`text-sm ${isSelected ? "text-white" : "text-black"}`}
              >
                {value.value}
              </ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

// InfoItem Component
interface InfoItemProps {
  text: string;
}

function InfoItem({ text }: InfoItemProps) {
  const { getColor } = useThemeColor();
  return (
    <ThemedView className="flex-row items-center mb-2">
      <AntDesign name="checkcircle" size={16} color="green" />
      <ThemedText className="ml-2 flex-1" style={{ color: getColor("text") }}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}
