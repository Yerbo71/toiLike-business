import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { useGlobalFilters } from '@/src/context/GlobalFilterContext';
import { CityEnum } from '@/src/context/GlobalFilterContext';

const localizedCities: Record<CityEnum, { en: string; ru: string; kz: string }> = {
  ALMATY: { en: 'Almaty', ru: 'Алматы', kz: 'Алматы' },
  ASTANA: { en: 'Astana', ru: 'Астана', kz: 'Астана' },
  SHYMKENT: { en: 'Shymkent', ru: 'Шымкент', kz: 'Шымкент' },
};

const CityChoosePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t, locale } = useI18n();
  const { city: selectedCity, setCity } = useGlobalFilters();
  const theme = useTheme();

  const cityList = (Object.keys(localizedCities) as CityEnum[])
    .map((key) => ({
      key,
      label: localizedCities[key][locale as 'en' | 'ru' | 'kz'],
    }))
    .filter((city) =>
      city.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleCitySelect = (cityKey: CityEnum) => {
    setCity(cityKey);
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
        data={cityList}
        keyExtractor={(item) => item.key}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item, index }) => {
          const isSelected = selectedCity === item.key;

          return (
            <TouchableOpacity onPress={() => handleCitySelect(item.key as CityEnum)}>
              <View
                style={{
                  padding: 16,
                  borderBottomWidth: index !== cityList.length - 1 ? 1 : 0,
                  borderBottomColor: theme.colors.outline,
                  backgroundColor: isSelected ? theme.colors.primaryContainer : 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.onSurface,
                    fontWeight: isSelected ? 'bold' : 'normal',
                    fontSize: 16,
                  }}
                >
                  {item.label}
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
