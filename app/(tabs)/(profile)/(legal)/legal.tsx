import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import ProfileListElement from "@/components/elements/ProfileListElement";
import { loadLegalFromDatoCMS } from "@/utils/api/datocms/legal";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Legal {
  id: string;
  title: string;
  content: any;
  slug: string;
  _status: string;
  publishedAt: string;
}

const LegalScreen: React.FC = () => {
  const { getColor, theme } = useThemeColor();
  const { locale } = useLanguage();
  const [legalPages, setLegalPages] = useState<Legal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const legalData = await loadLegalFromDatoCMS(locale);
        if (legalData?.length) {
          setLegalPages(legalData);
        }
      } catch (error) {
        console.error("Error loading news data:", error);
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
      contentContainerStyle={{ padding: 16, flexGrow: 1 }}
    >
      {isLoading ? (
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={getColor("text")} />
        </ThemedView>
      ) : (
        <ThemedView>
          {legalPages.map(
            (page, index) =>
              page._status === "published" && (
                <ProfileListElement
                  key={index}
                  leftIcon={theme === "dark" ? "list" : "list-outline"}
                  rightIcon="chevron-forward"
                  label={page.title}
                  selectedValue=""
                  onValueChange={() =>
                    router.push({
                      pathname: "/(tabs)/(profile)/(legal)/details",
                      params: {
                        title: page.title,
                        content: JSON.stringify(page.content),
                        slug: page.slug,
                        publishedAt: page.publishedAt,
                      },
                    })
                  }
                />
              )
          )}
        </ThemedView>
      )}
    </ScrollView>
  );
};

export default LegalScreen;
