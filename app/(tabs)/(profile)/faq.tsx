import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Collapsible } from "@/components/Collapsible";
import { loadFAQFromDatoCMS } from "@/utils/api/datocms/faq";

interface FAQItem {
  id: string;
  question: string;
  answer: {
    value: {
      document: {
        children: any[];
      };
    };
  };
}

export default function FAQScreen() {
  const { getColor } = useThemeColor();
  const { i18n, locale } = useLanguage();
  const [faqItems, setFAQItems] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const faqData = await loadFAQFromDatoCMS(locale);
        if (faqData?.length) {
          setFAQItems(faqData);
        }
      } catch (error) {
        console.error("Error loading FAQ data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [locale]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: getColor("background"),
      }}
      contentContainerStyle={{ padding: 16 }}
    >
      <ThemedText
        className="text-2xl font-bold mb-6"
        style={{ color: getColor("text") }}
      >
        {i18n.t("faq.title")}
      </ThemedText>
      {isLoading ? (
        <ActivityIndicator size="large" color={getColor("text")} />
      ) : faqItems.length === 0 ? (
        <ThemedText style={{ color: getColor("text") }}>
          {i18n.t("common.noData")}
        </ThemedText>
      ) : (
        faqItems.map((item) => (
          <Collapsible key={item.id} title={item.question}>
            {item?.answer?.value?.document?.children?.map(
              (child: any, index: number) => {
                if (child.type === "paragraph") {
                  return (
                    <ThemedText
                      key={index}
                      style={{
                        color: getColor("text"),
                        marginBottom: 8,
                      }}
                    >
                      {child.children[0].value}
                    </ThemedText>
                  );
                }
                return null;
              },
            )}
          </Collapsible>
        ))
      )}
    </ScrollView>
  );
}
