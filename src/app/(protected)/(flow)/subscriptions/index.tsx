import React from 'react';
import SubscriptionsPage from '@/src/pages/subscriptions';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionsBusiness } from '@/src/core/rest/user';
import { ActivityIndicator, Text, View } from 'react-native';
import { useI18n } from '@/src/context/LocaleContext';

export default function Subscriptions() {
  const { t } = useI18n();
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-vendor-id'],
    queryFn: () => getSubscriptionsBusiness(),
    staleTime: 1000 * 60 * 60,
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

  return <SubscriptionsPage subscriptionData={data ?? []} />
}
