import React, { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchProductData } from "@/utils/api/productApi";
import { useThemeColor } from "@/hooks/useThemeColor";
import HomeBannerView from "@/components/views/HomeBannerView";
import HomeItemView from "@/components/views/HomeItemView";

interface Value {
  id: string;
  value: string;
  option_id: string;
  metadata: null | any;
  created_at: string;
  updated_at: string;
  deleted_at: null | any;
}

interface Option {
  id: string;
  title: string;
  product_id: string;
  metadata: null | any;
  created_at: string;
  updated_at: string;
  deleted_at: null | any;
  values: Value[];
}

interface OptionOuter {
  id: string;
  value: string;
  option_id: string;
  option: Option[];
  metadata: null | any;
}

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
  inventory_quantity: number | 0;
}

interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  variants: Variant[];
  created_at: string;
}

export default function Index() {
  const router = useRouter();
  const { selectedCurrency } = useCurrency();
  const { getColor } = useThemeColor();
  const { i18n, locale } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const productData = await fetchProductData();
        if (productData.length > 0) {
          productData.sort(
            (a: Product, b: Product) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        }
        if (productData?.length) {
          setProducts(productData);
        }
      } catch (error) {
        console.error("Error loading product data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [locale]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <HomeItemView
        item={item}
        onPress={() =>
          router.push({
            pathname: "/details",
            params: { id: item.id },
          })
        }
        selectedCurrency={selectedCurrency}
      />
    ),
    [router, selectedCurrency]
  );

  return (
    <ThemedView className="flex-1">
      {isLoading ? (
        <ThemedText className="text-center text-lg">
          {i18n.t("common.loading")}
        </ThemedText>
      ) : (
        <>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingBottom: 20,
              flexGrow: 1,
            }}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <>
                <HomeBannerView />
                <ThemedText
                  className="text-2xl font-bold mb-4 mt-2 px-4"
                  style={{ color: getColor("text") }}
                >
                  {i18n.t("home.sectionTitle")}
                </ThemedText>
              </>
            )}
            extraData={selectedCurrency}
            getItemLayout={(data, index) => ({
              length: 120,
              offset: 120 * index,
              index,
            })}
          />
        </>
      )}
    </ThemedView>
  );
}
