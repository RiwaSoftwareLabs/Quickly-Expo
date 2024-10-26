// ProfileAvatar.tsx
import React from "react";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface ProfileAvatarProps {
  imageUri: string;
  name: string;
  email: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUri,
  name,
  email,
}) => {
  const colorScheme = useColorScheme();
  const { isRTL } = useLanguage();
  const { getColor } = useThemeColor();
  return (
    <ThemedView
      className={`flex-row items-center justify-between pt-12 px-6 ${isRTL ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <ThemedView
        className="w-16 h-16 rounded-full border items-center justify-center"
        style={{
          borderColor: Colors[colorScheme ?? "light"].primary,
          backgroundColor: getColor("primary"),
        }}
      >
        <ThemedText
          className="text-2xl font-bold"
          style={{
            color: getColor("background"),
          }}
        >
          {name.split(' ').map(word => word[0]).join('').toUpperCase()}
        </ThemedText>
      </ThemedView>
      {/* Name and Email */}
      <ThemedView className={`flex-1 ${isRTL ? "mr-4" : "ml-4"}`}>
        <ThemedText
          className="text-xl font-semibold"
          style={{
            color: getColor("text"),
            fontFamily: "SFProTextSemibold",
          }}
        >
          {name}
        </ThemedText>
        <ThemedText className="text-sm" style={{ color: getColor("gray") }}>
          {email}
        </ThemedText>
      </ThemedView>
      {/* Switch Account Icon */}
      {/* <Ionicons
        name="swap-horizontal"
        size={24}
        color={Colors[colorScheme ?? "light"].text}
      /> */}
    </ThemedView>
  );
};

export default ProfileAvatar;
