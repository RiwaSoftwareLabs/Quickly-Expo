import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const NoImageView = () => {
  return (
    <ThemedView className="w-full h-48 rounded-lg mb-4 bg-gray-200 flex items-center justify-center">
      <ThemedText>No Image Available</ThemedText>
    </ThemedView>
  );
};

export default NoImageView;
