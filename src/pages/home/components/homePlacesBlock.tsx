import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';
import { PreviewCard } from '@/src/shared/previewCard';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@/src/context/LocaleContext';
import { getPopularPlaces } from '@/src/core/rest/place';
import { EmptyView, ErrorView, LoadingView } from '@/src/shared';

const HomePlacesBlock = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const {
    data: places,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['popularPlaces'],
    queryFn: getPopularPlaces,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView />;
  }

  if (!places) {
    return <EmptyView />;
  }

  return (
    <View>
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text variant="titleMedium">{t('homePage.popularPlaces')}</Text>
        <TouchableOpacity
          onPress={() => router.push('/(ordering)/placeChoose')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            {t('system.all')}
          </Text>
          <Entypo name="chevron-right" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={places}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingLeft: 15, paddingBottom: 15, gap: 10 }}
        renderItem={({ item }) => (
          <PreviewCard
            image={{ uri: item.mainImage }}
            title={item.title}
            description={item.description || ''}
            rating={item.rating}
            onPress={() => {
              router.push({
                pathname: '/(application)/placeDetails/[id]',
                params: {
                  id: item.id,
                },
              });
            }}
          />
        )}
      />
    </View>
  );
};

export default HomePlacesBlock;
