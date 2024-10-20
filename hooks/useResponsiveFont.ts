import { useWindowDimensions } from "react-native";

const baseWidth = 375; // Base width (e.g., iPhone 13 mini width)

export function useResponsiveFont(size: number) {
  const { width } = useWindowDimensions();
  const scale = width / baseWidth;
  const newSize = size * scale;
  return Math.round(newSize);
}
