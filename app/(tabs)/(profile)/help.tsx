import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Linking,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadContactFromDatoCMS } from "@/utils/api/datocms/contact";

interface TitleDesc {
  id: string;
  title: string;
  description: {
    value: {
      document: {
        children: any[];
      };
    };
  };
}

interface IconLink {
  id: string;
  icon: {
    url: string;
  };
  url: string;
}

interface ContactData {
  titleDesc: TitleDesc[];
  iconLinks: IconLink[];
}

export default function HelpScreen() {
  const { getColor } = useThemeColor();
  const { i18n, locale, isRTL } = useLanguage();
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await loadContactFromDatoCMS(locale);
        if (data) {
          setContactData(data);
        }
      } catch (error) {
        console.error("Error loading contact data:", error);
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

  if (!contactData) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>{i18n.t("common.noData")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: getColor("background") }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {contactData.titleDesc.map((item) => (
        <ThemedView key={item.id} className="mb-6">
          <ThemedText
            className="text-2xl font-bold mb-2"
            style={{
              color: getColor("text"),
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {item.title}
          </ThemedText>
          {item.description.value.document.children.map((child, index) => {
            if (child.type === "paragraph") {
              return (
                <ThemedText
                  key={index}
                  className="mb-2"
                  style={{
                    color: getColor("text"),
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {child.children.map((span: any, spanIndex: number) => {
                    if (span.type === "link") {
                      return (
                        <ThemedText
                          key={spanIndex}
                          style={{ color: getColor("primary") }}
                          onPress={() => Linking.openURL(span.url)}
                        >
                          {span.children[0].value}
                        </ThemedText>
                      );
                    }
                    return (
                      <ThemedText key={spanIndex}>{span.value}</ThemedText>
                    );
                  })}
                </ThemedText>
              );
            }
            return null;
          })}
        </ThemedView>
      ))}
      <ThemedView className="mt-6 mb-8">
        <ThemedText className="text-lg font-semibold mb-4 text-center">
          {i18n.t("help.followUs")}
        </ThemedText>
        <ThemedView className="flex-row justify-center">
          {contactData.iconLinks.map((link) => (
            <Pressable
              key={link.id}
              onPress={() => Linking.openURL(link.url)}
              className="mx-3"
            >
              <Image
                source={{ uri: link.icon.url }}
                style={{
                  width: 40,
                  height: 40,
                  tintColor: getColor("text"),
                }}
                contentFit="contain"
              />
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
