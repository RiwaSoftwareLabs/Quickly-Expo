import React, { useState } from "react";
import { Pressable, Modal, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const DateOfBirthPicker: React.FC<{
  dob: Date | undefined;
  setDob: (date: Date) => void;
}> = ({ dob, setDob }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [temporaryDate, setTemporaryDate] = useState<Date | undefined>(
    dob || new Date(),
  );

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setTemporaryDate(selectedDate);
    }
  };

  const confirmDateSelection = () => {
    if (temporaryDate) {
      setDob(temporaryDate);
    }
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const { getColor } = useThemeColor();

  return (
    <ThemedView>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="border p-2.5 rounded-md mb-2"
        style={{ borderColor: getColor("border") }}
      >
        <ThemedText className="text-gray-700">
          {dob ? dob.toLocaleDateString() : "Select Date of Birth"}
        </ThemedText>
      </Pressable>

      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
        >
          <ThemedView className="flex-1 justify-center items-center bg-opacity-50">
            <ThemedView className="bg-white p-4 rounded-lg shadow-lg w-11/12">
              <DateTimePicker
                value={temporaryDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />

              {/* Confirm and Cancel Buttons */}
              <ThemedView className="flex-row justify-between mt-4">
                <Button title="Cancel" onPress={cancelDateSelection} />
                <Button title="Confirm" onPress={confirmDateSelection} />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
      )}
    </ThemedView>
  );
};

export default DateOfBirthPicker;
