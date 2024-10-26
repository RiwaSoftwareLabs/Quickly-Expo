import React, { useState } from "react";
import PhoneInput, { ICountry } from "react-native-international-phone-number";
import { useThemeColor } from "@/hooks/useThemeColor";

interface MobileInputProps {
  placeHolder: string;
  value: string;
  onChangeMobile: (phone: string) => void;
  setCountryCode: (country: ICountry) => void;
  defaultCountry: ICountry;
}

const MobileInput: React.FC<MobileInputProps> = ({
  placeHolder,
  value,
  onChangeMobile,
  setCountryCode,
  defaultCountry,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(
    defaultCountry || null
  );
  const { getColor } = useThemeColor();

  const handleInputValue = (phoneNumber: string) => {
    onChangeMobile(phoneNumber);
  };

  const handleSelectedCountry = (country: ICountry) => {
    if (country.cca2 !== selectedCountry?.cca2) {
      setCountryCode(country);
      setSelectedCountry(country);
    }
  };

  return (
    <PhoneInput
      value={value}
      onChangePhoneNumber={(phoneNumber) => handleInputValue(phoneNumber)}
      selectedCountry={selectedCountry}
      onChangeSelectedCountry={handleSelectedCountry}
      placeholder={placeHolder}
      modalHeight="90%"
      defaultCountry={defaultCountry?.cca2 as any || "AE"}
      phoneInputStyles={{
        container: {
          borderWidth: 1,
          borderColor: getColor("border"),
          borderRadius: 5,
          height: 45,
          width: "100%",
        },
        flagContainer: {
          backgroundColor: "#fff",
        },
        caret: {
          color: "#F3F3F3",
          fontSize: 16,
          display: "none",
        },
        callingCode: {
          fontSize: 14,
          color: "black",
          fontWeight: "500",
        },
        input: {
          color: "black",
          fontSize: 14,
          height: "100%",
        },
      }}
      modalStyles={{
        modal: {
          backgroundColor: "#fff",
          borderWidth: 1,
        },
        searchInput: {
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#000",
          color: "#000",
          backgroundColor: "#fff",
          paddingHorizontal: 12,
          height: 35,
        },
        countryButton: {
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#000",
          backgroundColor: "#fff",
          marginVertical: 4,
          height: 35,
        },
      }}
    />
  );
};

export default MobileInput;
