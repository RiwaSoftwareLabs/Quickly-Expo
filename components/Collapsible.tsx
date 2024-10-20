import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren, useState } from "react";
import { Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLanguage } from "@/contexts/LanguageContext";

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { getColor } = useThemeColor();
  const { isRTL } = useLanguage();

  return (
    <ThemedView>
      <Pressable
        className={`flex-row items-center space-x-2 ${isRTL ? "flex-row-reverse" : ""}`}
        onPress={() => setIsOpen((value) => !value)}
      >
        <Ionicons
          name={
            isOpen
              ? "chevron-down"
              : isRTL
                ? "chevron-back-outline"
                : "chevron-forward-outline"
          }
          size={18}
          color={getColor("icon")}
        />
        <ThemedText type="defaultSemiBold" style={{ color: getColor("text") }}>
          {title}
        </ThemedText>
      </Pressable>
      {isOpen && (
        <ThemedView className={`mt-2 ${isRTL ? "mr-6" : "ml-6"}`}>
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}
