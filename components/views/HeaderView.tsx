import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StatusBar } from "react-native";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLanguage } from "@/contexts/LanguageContext";

type HeaderViewProps = {
  title?: string;
  onPressBack: () => void;
  pressBackTitle?: string;
};

const HeaderView: React.FC<HeaderViewProps> = ({
  title,
  onPressBack,
  pressBackTitle,
}) => {
  const { getColor, theme } = useThemeColor();
  const { isRTL, i18n } = useLanguage();
  const route = useRoute();
  const isFocused = useIsFocused();
  const [navTitle, setNavTitle] = useState(route.name);

  useEffect(() => {
    if (isFocused) {
      setNavTitle(route.name);
    }
  }, [isFocused]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor("background"),
        paddingTop: StatusBar.currentHeight ?? 0,
        borderColor: theme === "light" ? getColor("border") : "transparent",
      }}
      className={`border-b`}
    >
      <ThemedView
        className={`flex-row items-center justify-between w-full ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <Pressable
          onPress={onPressBack}
          className={`p-2 flex-row items-center ${isRTL ? "flex-row-reverse" : ""}`}
          hitSlop={10}
          style={{ width: "20%" }}
        >
          {({ pressed }) => (
            <>
              <Ionicons
                name={isRTL ? "chevron-forward" : "chevron-back"}
                size={24}
                color={pressed ? "#808080" : getColor("text")}
              />
              <ThemedText
                style={{
                  color: pressed ? "#808080" : getColor("text"),
                  marginLeft: isRTL ? 0 : 4,
                  marginRight: isRTL ? 4 : 0,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {pressBackTitle ?? i18n.t("common.goBack")}
              </ThemedText>
            </>
          )}
        </Pressable>
        <ThemedView style={{ width: "60%", alignItems: "center" }}>
          <ThemedText
            className="font-bold text-center"
            style={{
              color: getColor("text"),
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title ?? navTitle}
          </ThemedText>
        </ThemedView>
        <ThemedView style={{ width: "20%" }} />
      </ThemedView>
    </SafeAreaView>
  );
};

export default HeaderView;
