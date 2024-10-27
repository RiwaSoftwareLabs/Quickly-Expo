import React from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLanguage } from "@/contexts/LanguageContext";

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

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const SectionCategoryItems: React.FC<{ sections: Section[] }> = ({ sections }) => {
  const { getColor } = useThemeColor();
  const { isRTL } = useLanguage();

  const renderCategoryItem = (item: Category, index: number) => {
    const categoryTitle = isRTL ? item.category_title_ar : item.category_title_en;
    console.log(categoryTitle);
    return (
      <ThemedView key={`category-${index}`} className="items-center w-1/4 px-1" style={{ alignSelf: 'flex-start' }}>
        <ThemedView 
          className="w-16 h-16 rounded-full justify-center items-center mb-2" 
          style={{ backgroundColor: getColor('surface') }}
        >
          <Image
            source={{ uri: item.icon }}
            style={{ width: 50, height: 50 }}
            placeholder={blurhash}
            contentFit="contain"
            transition={500}
          />
        </ThemedView>
        <ThemedText 
          className="text-center text-xs" 
          style={{ color: getColor('text') }}
          numberOfLines={2}
        >
          {categoryTitle}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <ScrollView>
      {sections.map((section, index) => {
        const title = isRTL? section.title_ar: section.title_en;
        return (
          <ThemedView key={`section-${index}`} className="mb-4">
            <ThemedView className="flex-row items-center mb-2">
              <ThemedView 
                className="w-2 h-6 mr-2" 
                style={{ backgroundColor: getColor('gray') }}
              />
              <ThemedText 
                className="text-lg font-bold" 
                style={{ 
                  color: getColor('gray'),
                  textAlign: isRTL ? 'right' : 'left'
                }}
              >
                {title}
              </ThemedText>
            </ThemedView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {section.categories.map((item, index) => renderCategoryItem(item, index))}
            </View>
          </ThemedView>
        );
      })}
    </ScrollView>
  );
};

export default SectionCategoryItems;
