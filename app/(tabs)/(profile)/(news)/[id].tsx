import { Linking, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { useThemeColor } from "@/hooks/useThemeColor";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function NewsDetails() {
  const { id, title, image, content, publishedAt } = useLocalSearchParams<{
    id: string;
    title: string;
    image: string;
    content: any;
    publishedAt: string;
  }>();
  const { getColor } = useThemeColor();
  const { i18n, isRTL } = useLanguage();
  const navigation = useNavigation();
  const [parsedContent, setParsedContent] = useState<any>(null);

  useEffect(() => {
    if (title) {
      navigation.setOptions({ title: title as string });
    }
    setParsedContent(JSON.parse(content).value.document.children);
  }, [navigation, title]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <ThemedView className="p-4">
          <ThemedText
            className="text-xl font-semibold mb-2"
            style={{
              color: getColor("text"),
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {title}
          </ThemedText>
          <ThemedText
            className="text-sm mb-2"
            style={{
              color: getColor("icon"),
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {i18n.t("news.publishedOn")}: {publishedAt}
          </ThemedText>
          <Image
            placeholder={{ blurhash }}
            source={{ uri: image as string }}
            className="w-full h-48"
            contentFit="contain"
            transition={500}
          />
        </ThemedView>
        <ThemedView className="p-4">
          <ThemedView>
            {parsedContent?.map((child: any, index: number) => {
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
                        onPress={() => Linking.openURL(child.children[0].url)}
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
                  >
                    {child.children.map((span: any, spanIndex: number) => (
                      <ThemedText
                        key={spanIndex}
                        style={{
                          fontWeight:
                            span.marks && span.marks.includes("strong")
                              ? "bold"
                              : "normal",
                          fontStyle:
                            span.marks && span.marks.includes("emphasis")
                              ? "italic"
                              : "normal",
                          textDecorationLine:
                            span.marks && span.marks.includes("underline")
                              ? "underline"
                              : "none",
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
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
