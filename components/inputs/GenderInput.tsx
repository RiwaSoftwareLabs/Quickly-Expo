import React from 'react';
import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLanguage } from '@/contexts/LanguageContext';

interface GenderInputProps {
  value: string;
  onChangeGender: (gender: string) => void;
}

const GenderInput: React.FC<GenderInputProps> = ({ value, onChangeGender }) => {
  const { getColor } = useThemeColor();
  const { i18n } = useLanguage();

  const genders = [
    { value: 'male', label: i18n.t('auth.male') },
    { value: 'female', label: i18n.t('auth.female') },
  ];

  return (
    <View className="flex-row justify-between mb-2">
      {genders.map((gender, index) => (
        <React.Fragment key={gender.value}>
          <Pressable
            onPress={() => onChangeGender(gender.value)}
            className={`flex-1 py-3 rounded-md ${
              gender.value === value ? '' : 'opacity-50'
            }`}
            style={{
              backgroundColor:
                gender.value === value ? getColor('primary') : getColor('surface'),
              borderColor: getColor('border'),
              borderWidth: 1
            }}
          >
            <ThemedText
              className="text-center font-semibold"
              style={{
                color: gender.value === value ? getColor('secondary') : getColor('text'),
              }}
            >
              {gender.label}
            </ThemedText>
          </Pressable>
          {index === 0 && <View style={{ width: 16 }} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default GenderInput;
