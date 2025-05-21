import React from 'react';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import { PreviewCard } from '@/src/shared/previewCard';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPopularEventTemplates } from '@/src/core/rest/templates';
import { useI18n } from '@/src/context/LocaleContext';
import { EmptyView, ErrorView, LoadingView } from '@/src/shared';

const HomeEventsBlock = () => {
  const { t } = useI18n();
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['popularEventTemplates'],
    queryFn: getPopularEventTemplates,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView />;
  }

  if (!events) {
    return <EmptyView />;
  }

  return (
    <View>
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text variant="titleMedium">{t('homePage.popularEvents')}</Text>
      </View>
      <FlatList
        data={events?.eventTemplates}
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
                pathname: '/(application)/details/[id]',
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

export default HomeEventsBlock;
