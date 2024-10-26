import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ProfileElementProps {
  leftIcon: keyof typeof Ionicons.glyphMap;
  rightIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const ProfileListElement: React.FC<ProfileElementProps> = ({
  leftIcon,
  rightIcon,
  label,
  selectedValue,
  onValueChange,
}) => {
  const { isRTL } = useLanguage();
  const { getColor } = useThemeColor();

  return (
    <Pressable
      onPress={() => onValueChange(selectedValue)}
      className={`flex-row items-center py-4 ${
        isRTL ? "flex-row-reverse" : ""
      }`}
    >
      {({ pressed }) => (
        <>
          {/* Left (or right in RTL) icon */}
          <Ionicons
            name={leftIcon}
            size={24}
            style={{
              color: getColor("text"),
              marginHorizontal: 16,
              opacity: pressed ? 0.5 : 1,
            }}
          />
          {/* Label and selected value */}
          <ThemedView
            className={`flex-1 flex-row justify-between items-center ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{
              backgroundColor: getColor("surface")
            }}
          >
            <ThemedText
              className={`text-md  ${isRTL ? "text-right" : "text-left"}`}
              style={{
                color: getColor("text"),
                fontFamily: "SFProTextMedium",
                opacity: pressed ? 0.5 : 1
              }}
            >
              {label}
            </ThemedText>
          </ThemedView>
          {/* Right (or left in RTL) icon and selected value */}
          <ThemedView
            className={`flex-row items-center ${isRTL ? "flex-row-reverse" : ""}`}
            style={{
              backgroundColor: getColor("surface")
            }}
          >
            <ThemedText
              className={`text-sm ${isRTL ? "ml-2" : "mr-2"}`}
              style={{
                color: getColor("gray"),
                opacity: pressed ? 0.5 : 1,
              }}
            >
              {selectedValue || ""}
            </ThemedText>
            <Ionicons
              name={rightIcon}
              size={24}
              style={{
                color: getColor("text"),
                transform: [{ rotate: isRTL ? "180deg" : "0deg" }],
                opacity: pressed ? 0.5 : 1,
                marginRight: isRTL ? 0 : 8, // Margin on the right for LTR
                marginLeft: isRTL ? 8 : 0, // Margin on the left for RTL
              }}
            />
          </ThemedView>
        </>
      )}
    </Pressable>
  );
};

export default ProfileListElement;
