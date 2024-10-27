import React, { useState } from 'react';
import { View, Pressable, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

interface HomeHeaderViewProps {
  location: string;
}

const HomeHeaderView: React.FC<HomeHeaderViewProps> = ({ location }) => {
  const { getColor } = useThemeColor();
  const { i18n, isRTL } = useLanguage();
  const { cartData } = useCart();
  const [searchText, setSearchText] = useState('');

  const totalQuantity = cartData?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  return (
    <ThemedView className="px-4 pt-12 pb-4">
      <ThemedView className="flex-row justify-between items-center mb-4">
        <Pressable className="flex-row items-center">
          <ThemedText className="text-lg font-semibold mr-1" style={{ color: getColor('text'), fontFamily: 'SFProTextMedium' }}>
            {location}
          </ThemedText>
          <Ionicons name="chevron-down" size={20} color={getColor('text')} />
        </Pressable>
        <ThemedView className="flex-row">
          <Pressable className="mr-4">
            <ThemedView className="relative p-2 rounded-full" style={{ backgroundColor: getColor('surface') }}>
              <Ionicons name="cart-outline" size={24} color={getColor('text')} />
              {totalQuantity > 0 && (
                <ThemedView
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: getColor('primary') }}
                >
                  <ThemedText className="text-xs" style={{ color: getColor('background') }}>
                    {totalQuantity}
                  </ThemedText> 
                </ThemedView>
              )}
            </ThemedView>
          </Pressable>
          <Pressable>
            <ThemedView className="p-2 rounded-full" style={{ backgroundColor: getColor('surface') }}>
              <Ionicons name="notifications-outline" size={24} color={getColor('text')} />
            </ThemedView>
          </Pressable>
        </ThemedView>
      </ThemedView>
      <ThemedView
        className="flex-row items-center rounded-full px-4 py-2"
        style={{ backgroundColor: getColor('surface') }}
      >
        <Ionicons name="search" size={20} color={getColor('gray')} />
        <TextInput
          className="flex-1 ml-2"
          placeholder={i18n.t('home.searchPlaceholder')}
          placeholderTextColor={getColor('gray')}
          value={searchText}
          onChangeText={setSearchText}
          style={{
            color: getColor('text'),
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
          }}
        />
        {searchText !== '' && (
          <Pressable onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color={getColor('gray')} />
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default HomeHeaderView;

