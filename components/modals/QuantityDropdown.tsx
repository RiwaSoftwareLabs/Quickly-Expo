import React, { useState, useRef, useEffect } from "react";
import { Pressable, Modal, View, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

interface QuantityDropdownProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantityDropdown: React.FC<QuantityDropdownProps> = ({
  quantity,
  onQuantityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getColor } = useThemeColor();
  const buttonRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [buttonWidth, setButtonWidth] = useState(0);

  const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const openDropdown = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownPosition({ top: pageY + height, left: pageX, width });
      setButtonWidth(width);
      setIsOpen(true);
    });
  };

  useEffect(() => {
    if (isOpen) {
      buttonRef.current?.measure((x, y, width) => {
        setButtonWidth(width);
      });
    }
  }, [isOpen]);

  return (
    <ThemedView>
      <Pressable
        ref={buttonRef}
        onPress={openDropdown}
        className={`flex-row items-center border rounded-lg px-1.5 py-0.4 ${
          isOpen ? "rounded-b-none border-b-0" : ""
        }`}
        style={{ borderColor: getColor("border") }}
      >
        <ThemedText
          className="mr-1.5"
          style={{ color: getColor("text"), fontSize: 12 }}
        >
          {quantity}
        </ThemedText>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={14}
          color={getColor("text")}
        />
      </Pressable>
      <Modal visible={isOpen} transparent animationType="none">
        <Pressable className="flex-1" onPress={() => setIsOpen(false)}>
          <ThemedView
            className="absolute border border-t-0 rounded-b-lg"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: buttonWidth,
              borderColor: getColor("border"),
              backgroundColor: getColor("background"),
            }}
          >
            <ScrollView className="max-h-[200px]">
              {quantities.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => {
                    onQuantityChange(q);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2"
                >
                  <ThemedText style={{ color: getColor("text"), fontSize: 12 }}>
                    {q}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </ThemedView>
        </Pressable>
      </Modal>
    </ThemedView>
  );
};

export default QuantityDropdown;
