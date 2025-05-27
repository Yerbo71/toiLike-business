import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, View,Text } from 'react-native';
import { useI18n } from '@/src/context/LocaleContext';
import PlaceCreatePage from '@/src/pages/placeCreate';
import { getPlaceID } from '@/src/core/rest/place-controller';

export default function PlaceCreate() {
  const params = useLocalSearchParams();
  const placeId = Number(params.id);
  const { t } = useI18n();

  const { data, isLoading, error } = useQuery({
    queryKey: ['place-id', placeId],
    queryFn: () => getPlaceID(placeId),
    enabled: !!placeId,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t("system.error")}</Text>
      </View>
    );
  }


  return <PlaceCreatePage placeCreateData={data} />;
}
