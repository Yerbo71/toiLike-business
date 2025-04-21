import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { useEvent } from '@/src/context/EventContext';

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

const CountryChoosePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t, locale } = useI18n();
  const { event, setEvent } = useEvent();

  const filteredCities =
    cities[locale as keyof Cities]?.filter((city) =>
      city.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const handleCitySelect = (city: string) => {
    setEvent({ ...event, city });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Searchbar
        placeholder={t('system.search')}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCities}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: 16 }}
        renderItem={({ item, index }) => {
          const isSelected = event.city === item;

          return (
            <TouchableOpacity onPress={() => handleCitySelect(item)}>
              <View
                style={{
                  padding: 12,
                  borderBottomWidth:
                    index !== filteredCities.length - 1 ? 1 : 0,
                  borderBottomColor: '#ccc',
                  backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {item}
                </Text>
                {isSelected && (
                  <Text style={{ fontSize: 18, color: '#1890ff' }}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default CountryChoosePage;
