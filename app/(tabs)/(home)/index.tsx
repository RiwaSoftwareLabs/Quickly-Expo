import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchSectionsWithCategories } from "@/utils/api/homeApi";
import { useThemeColor } from "@/hooks/useThemeColor";
import HomeHeaderView from "@/components/views/HomeHeaderView";
import SectionCategoryItems from "@/components/views/SectionCategoryItems";

interface Category {
  id: string;
  section_id: string;
  category_title_en: string;
  category_title_ar: string;
  icon: string;
}

interface Section {
  section_id: string;
  title_en: string;
  title_ar: string;
  status: boolean;
  created_at: string;
  categories: Category[];
}

export default function Index() {
  const router = useRouter();
  const { selectedCurrency } = useCurrency();
  const { getColor } = useThemeColor();
  const { i18n, locale } = useLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSectionsWithCategories();
        setSections(data);
      } catch (error) {
        console.error("Failed to load sections:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    };

    loadSections();
  }, []);

  const renderItem = ({ item }: { item: Section }) => {
    return <SectionCategoryItems sections={[item]} />;
  };

  return (
    <ThemedView className="flex-1">
      {isLoading ? (
        <ThemedText className="text-center text-lg">
          {i18n.t("common.loading")}
        </ThemedText>
      ) : (
        <FlatList
          data={sections}
          renderItem={renderItem}
          keyExtractor={(item: Section) => `section-${item.section_id}`}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: 1,
          }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <HomeHeaderView location={"ssss"} />}
          extraData={selectedCurrency}
        />
      )}
    </ThemedView>
  );
}
