import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { loadNewsFromDatoCMS } from "@/utils/api/datocms/news";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

interface News {
  id: string;
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
  title: string;
  content: any;
  publishedAt: string;
}

export default function NewsScreen() {
  const { isRTL, i18n } = useLanguage();
  const { getColor } = useThemeColor();
  const { locale } = useLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const newsData = await loadNewsFromDatoCMS(locale);
        if (newsData.length > 0) {
          newsData.sort(
            (a: News, b: News) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime(),
          );
        }
        if (newsData?.length) {
          setNews(newsData);
        }
      } catch (error) {
        console.error("Error loading news data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [locale]);

  const handleNewsPress = (id: string) => {
    const item = news.find((item) => item.id === id);
    if (item) {
      router.push({
        pathname: "/(tabs)/(profile)/(news)/[id]",
        params: {
          id: item.id,
          title: item.title,
          content: JSON.stringify(item.content),
          image: item.image.responsiveImage.src,
          publishedAt: item.publishedAt,
        },
      });
    }
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView className="flex-1 p-4">
        {isLoading ? (
          <ThemedView className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={getColor("text")} />
          </ThemedView>
        ) : news.length === 0 ? (
          <ThemedView className="flex-1 justify-center items-center">
            <ThemedText className="text-center text-lg">
              {i18n.t("common.noData")}
            </ThemedText>
          </ThemedView>
        ) : (
          news.map((item) => (
            <Pressable key={item.id} onPress={() => handleNewsPress(item.id)}>
              <ThemedView
                className="mb-6 rounded-lg overflow-hidden shadow-lg"
                style={{
                  backgroundColor: getColor("background"),
                  shadowColor: getColor("text"),
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  borderColor: getColor("primary"),
                  borderWidth: 1,
                }}
              >
                <Image
                  source={{ uri: item.image.responsiveImage.src }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                <ThemedView className="p-4">
                  <ThemedText
                    className="text-xl font-semibold mb-2"
                    style={{
                      color: getColor("text"),
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {item.title}
                  </ThemedText>
                  <ThemedView>
                    {item.content.value.document.children.map(
                      (child: any, index: number) => {
                        if (child.type === "heading") {
                          return (
                            <ThemedText
                              key={index}
                              className="text-lg font-bold mb-2"
                              style={{
                                color: getColor("text"),
                                textAlign: isRTL ? "right" : "left",
                              }}
                            >
                              {child.children[0].type === "link" ? (
                                <ThemedText
                                  onPress={() =>
                                    Linking.openURL(child.children[0].url)
                                  }
                                  style={{ textDecorationLine: "underline" }}
                                >
                                  {child.children[0].children[0].value}
                                </ThemedText>
                              ) : (
                                child.children[0].value
                              )}
                            </ThemedText>
                          );
                        } else if (child.type === "paragraph") {
                          return (
                            <ThemedText
                              key={index}
                              className="mb-2"
                              style={{
                                color: getColor("text"),
                                textAlign: isRTL ? "right" : "left",
                              }}
                              numberOfLines={3}
                              ellipsizeMode="tail"
                            >
                              {child.children[0].value}
                            </ThemedText>
                          );
                        }
                      },
                    )}
                  </ThemedView>
                  <ThemedText
                    className="text-sm"
                    style={{
                      color: getColor("icon"),
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {i18n.t("news.publishedOn")}: {item.publishedAt}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Pressable>
          ))
        )}
      </ThemedView>
    </ScrollView>
  );
}
