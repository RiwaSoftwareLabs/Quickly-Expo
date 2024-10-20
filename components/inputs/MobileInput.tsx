import React, { useState } from "react";
import PhoneInput, { ICountry } from "react-native-international-phone-number";

interface MobileInputProps {
  placeHolder: string;
  value: string;
  onChangeMobile: (phone: string) => void;
  setCountryCode: (country: ICountry) => void;
}

const MobileInput: React.FC<MobileInputProps> = ({
  placeHolder,
  value,
  onChangeMobile,
  setCountryCode,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);

  const handleInputValue = (phoneNumber: string) => {
    onChangeMobile(phoneNumber);
  };

  const handleSelectedCountry = (country: ICountry) => {
    setCountryCode(country);
    setSelectedCountry(country);
  };

  return (
    <PhoneInput
      value={value}
      onChangePhoneNumber={handleInputValue}
      selectedCountry={selectedCountry}
      onChangeSelectedCountry={handleSelectedCountry}
      placeholder={placeHolder}
      modalHeight="90%"
      defaultCountry="QA"
      phoneInputStyles={{
        container: {
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "black",
          borderRadius: 5,
          height: 35,
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
