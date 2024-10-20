import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadAboutFromDatoCMS } from "@/utils/api/datocms/about";

interface AboutData {
  image: {
    responsiveImage: {
      src: string;
      alt?: string;
      width: number;
      height: number;
      sizes: string;
      base64: string;
    };
  };
  content: {
    value: {
      document: {
        children: any[];
      };
    };
  };
}

export default function AboutScreen() {
  const { getColor } = useThemeColor();
  const { i18n, locale, isRTL } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await loadAboutFromDatoCMS(locale);
        if (data) {
          setAboutData(data);
        }
      } catch (error) {
        console.error("Error loading about data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [locale]);

  if (isLoading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={getColor("text")} />
      </ThemedView>
    );
  }

  if (!aboutData) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>{i18n.t("common.noData")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: getColor("background") }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: aboutData.image.responsiveImage.src }}
        style={{ width: "100%", height: 280 }}
        contentFit="cover"
      />
      <ThemedView className="p-4">
        {aboutData.content.value.document.children.map((child, index) => {
          if (child.type === "paragraph") {
            return (
              <ThemedText
                key={index}
                className="mb-4"
                style={{
                  color: getColor("text"),
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {child.children.map((span: any, spanIndex: number) => (
                  <ThemedText
                    key={spanIndex}
                    style={{
                      fontWeight:
                        span.marks && span.marks.includes("strong")
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {span.value}
                  </ThemedText>
                ))}
              </ThemedText>
            );
          }
          return null;
        })}
      </ThemedView>
    </ScrollView>
  );
}
