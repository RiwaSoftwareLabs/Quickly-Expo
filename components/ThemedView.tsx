import { View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { getColor } = useThemeColor();
  const backgroundColor =
    lightColor || darkColor ? getColor("background") : getColor("background");

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
