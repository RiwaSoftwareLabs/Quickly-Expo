import { Text, type TextProps } from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useResponsiveFont } from "@/hooks/useResponsiveFont";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  className?: string;
};

export function ThemedText({
  lightColor,
  darkColor,
  type = "default",
  className,
  style,
  ...rest
}: ThemedTextProps) {
  const { isRTL } = useLanguage();
  const { getColor } = useThemeColor();

  const baseClasses = [isRTL ? "text-right" : "text-left", className];

  const typeClasses = {
    default: "text-base",
    title: "text-4xl font-bold",
    defaultSemiBold: "text-base font-semibold",
    subtitle: "text-xl font-bold",
    link: "text-base text-blue-600",
  };

  const textColor =
    lightColor || darkColor ? getColor("tint") : getColor("text");

  const baseFontSize = {
    default: 14,
    title: 34,
    defaultSemiBold: 14,
    subtitle: 18,
    link: 14,
  };

  const responsiveFontSize = useResponsiveFont(baseFontSize[type]);

  const fontFamily = {
    default: "SFProTextRegular",
    title: "SFProTextBold",
    defaultSemiBold: "SFProTextSemibold",
    subtitle: "SFProTextBold",
    link: "SFProTextRegular",
  };

  return (
    <Text
      className={`${baseClasses.join(" ")} ${typeClasses[type]}`}
      style={[
        {
          color: textColor,
          backgroundColor: "transparent",
          fontSize: responsiveFontSize,
          fontFamily: fontFamily[type],
        },
        style,
      ]}
      {...rest}
    />
  );
}
