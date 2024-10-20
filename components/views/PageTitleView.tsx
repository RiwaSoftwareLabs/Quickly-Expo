import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";

interface PageTitleProps {
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const PageTitle: React.FC<PageTitleProps> = ({ title, size = "lg" }) => {
  const { getColor } = useThemeColor();

  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <ThemedText
      className={`${sizeClasses[size]} font-bold mb-4 px-4`}
      style={{
        color: getColor("text"),
        fontFamily: "SFProTextBold",
      }}
    >
      {title}
    </ThemedText>
  );
};

export default PageTitle;
