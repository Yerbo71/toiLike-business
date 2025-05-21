import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { useGlobalFilters } from '@/src/context/GlobalFilterContext';

interface Cities {
  en: string[];
  ru: string[];
  kk: string[];
}

const cities: Cities = {
  en: ['Almaty', 'Astana', 'Shymkent'],
  ru: ['Алматы', 'Астана', 'Шымкент'],
  kk: ['Алматы', 'Астана', 'Шымкент'],
};

const CityChoosePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t, locale } = useI18n();
  const { city: selectedCity, setCity } = useGlobalFilters();
  const theme = useTheme();

  const filteredCities =
    cities[locale as keyof Cities]?.filter((city) =>
      city.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const handleCitySelect = (city: string) => {
    setCity(city);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <Searchbar
        placeholder={t('system.search')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          elevation: 2,
        }}
        iconColor={theme.colors.onSurface}
        inputStyle={{ color: theme.colors.onSurface }}
      />
      <FlatList
        data={filteredCities}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item, index }) => {
          const isSelected = selectedCity === item;

          return (
            <TouchableOpacity onPress={() => handleCitySelect(item)}>
              <View
                style={{
                  padding: 16,
                  borderBottomWidth:
                    index !== filteredCities.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.outline,
                  backgroundColor: isSelected
                    ? theme.colors.primaryContainer
                    : 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 8,
                  marginVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.onSurface,
                    fontWeight: isSelected ? 'bold' : 'normal',
                    fontSize: 16,
                  }}
                >
                  {item}
                </Text>
                {isSelected && (
                  <Text
                    style={{
                      fontSize: 18,
                      color: theme.colors.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default CityChoosePage;
