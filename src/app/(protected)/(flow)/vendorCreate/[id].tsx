import React from 'react';
import VendorCreatePage from '@/src/pages/vendorCreate/index';
import { useLocalSearchParams } from 'expo-router';
import {getUserVendorID} from "@/src/core/rest/user-vendor-controller"
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, View,Text } from 'react-native';
import { useI18n } from '@/src/context/LocaleContext';

export default function VendorCreate() {
  const params = useLocalSearchParams();
  const vendorServiceId = Number(params.id);
  const { t } = useI18n();

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-vendor-id', vendorServiceId],
    queryFn: () => getUserVendorID(vendorServiceId),
    enabled: !!vendorServiceId,
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


  return <VendorCreatePage vendorCreateData={data} />;
}
