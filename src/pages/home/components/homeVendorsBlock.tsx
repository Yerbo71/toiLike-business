import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Entypo from '@expo/vector-icons/Entypo';
import { PreviewCard } from '@/src/shared/previewCard';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPopularVendors } from '@/src/core/rest/userVendor';
import { useI18n } from '@/src/context/LocaleContext';

const HomeVendorsBlock = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const {
    data: vendors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['popularVendors'],
    queryFn: getPopularVendors,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: theme.colors.error }}>
          {t('system.failedLoad')}
        </Text>
      </View>
    );
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
        <Text variant="titleMedium">{t('homePage.popularVendors')}</Text>
        <TouchableOpacity
          onPress={() => router.push('/(ordering)/vendorsChoose')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            {t('system.all')}
          </Text>
          <Entypo name="chevron-right" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={vendors}
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
            experience={String(item.experience)}
            averageCost={item.averageCost}
            serviceType={item.serviceType}
            onPress={() => {
              router.push({
                pathname: '/(application)/vendorDetails/[id]',
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

export default HomeVendorsBlock;
