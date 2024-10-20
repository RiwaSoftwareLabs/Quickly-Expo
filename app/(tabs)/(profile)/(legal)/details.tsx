import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function TermsAndConditionsScreen() {
  const { i18n, isRTL } = useLanguage();
  const { getColor } = useThemeColor();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [pageTitle, setPageTitle] = useState<string>("");

  useEffect(() => {
    if (params && params.title) {
      setPageTitle(params.title as string);
    }
  }, [params]);

  useEffect(() => {
    if (pageTitle) {
      navigation.setOptions({ title: pageTitle });
    }
  }, [pageTitle]);

  if (!params || !params.content) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>{i18n.t("common.noData")}</ThemedText>
      </ThemedView>
    );
  }

  const content = JSON.parse(params.content as string);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: getColor("background"),
      }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {content.value.document.children.map((child: any, index: number) => {
        if (child.type === "heading") {
          return (
            <ThemedText
              key={index}
              className="text-xl font-semibold mt-4 mb-2"
              style={{
                color: getColor("text"),
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {child.children[0].value}
            </ThemedText>
          );
        } else if (child.type === "paragraph") {
          return (
            <ThemedView key={index} className="mb-4">
              <ThemedText
                className="font-bold"
                style={{
                  color: getColor("text"),
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {child.children[0].value}
              </ThemedText>
              {child.children[1]?.value && (
                <ThemedText
                  style={{
                    color: getColor("text"),
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {child.children[1].value}
                </ThemedText>
              )}
            </ThemedView>
          );
        }
        return null;
      })}
    </ScrollView>
  );
}
