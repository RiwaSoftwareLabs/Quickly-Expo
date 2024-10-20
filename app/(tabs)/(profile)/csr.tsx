import React, { useEffect, useState } from "react";
import { ScrollView, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLanguage } from "@/contexts/LanguageContext";
import { loadCSRFromDatoCMS } from "@/utils/api/datocms/csr";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface CSRData {
  bannerImage: {
    responsiveImage: {
      src: string;
      alt?: string;
      width: number;
      height: number;
      sizes: string;
      base64: string;
    };
  };
  sections: {
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
    link: string;
  }[];
}

export default function CSRScreen() {
  const { getColor } = useThemeColor();
  const { i18n, locale, isRTL } = useLanguage();
  const [csrData, setCSRData] = useState<CSRData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadCSRFromDatoCMS(locale);
        if (data) {
          setCSRData(data);
        }
      } catch (error) {
        console.error("Error loading CSR data:", error);
      }
    };
    loadData();
  }, [locale]);

  if (!csrData) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText className="text-lg" style={{ color: getColor("text") }}>
          {i18n.t("common.loading")}
        </ThemedText>
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
        source={{ uri: csrData.bannerImage.responsiveImage.src }}
        style={{ width: "100%", height: 280 }}
        contentFit="cover"
        placeholder={{ blurhash }}
        transition={500}
      />
      {csrData.sections.map((section, index) => (
        <ThemedView
          key={index}
          className={`flex-row ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          } p-4 mb-4`}
        >
          <Image
            source={{ uri: section.image.responsiveImage.src }}
            style={{ width: 150, height: 150, borderRadius: 8 }}
            contentFit="cover"
            placeholder={{ blurhash }}
            transition={500}
          />
          <ThemedView className="flex-1 px-4">
            {section.content.value.document.children.map(
              (child, childIndex) => {
                if (child.type === "paragraph") {
                  return (
                    <ThemedText
                      key={childIndex}
                      className="mb-2"
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
              }
            )}
            {section.link && (
              <Pressable
                onPress={() => Linking.openURL(section.link)}
                className="p-2 rounded mt-2"
                style={{ backgroundColor: getColor("primary") }}
              >
                <ThemedText
                  className="text-center"
                  style={{ color: getColor("secondary") }}
                >
                  {i18n.t("csr.downloadReport")}
                </ThemedText>
              </Pressable>
            )}
          </ThemedView>
        </ThemedView>
      ))}
    </ScrollView>
  );
}
