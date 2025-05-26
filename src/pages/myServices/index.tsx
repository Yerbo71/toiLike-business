import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getUserVendorByUser } from '@/src/core/rest/user-vendor-controller';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useI18n } from '@/src/context/LocaleContext';
import { ServiceCard } from '@/src/pages/myServices/components/serviceCard';

const MyServicesPage = () => {
  const theme = useTheme();
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const { t } = useI18n();

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['myServices'],
    queryFn: () => getUserVendorByUser(),
    staleTime: 5 * 60 * 1000,
  });

  const onRefresh = useCallback(async () => {
    setManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setManualRefreshing(false);
    }
  }, [refetch]);

  if (isLoading && !manualRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={48}
          color={theme.colors.error}
        />
        <Text style={{ color: theme.colors.error, marginVertical: 16 }}>
          {t('system.error')}
        </Text>
        <Button mode="contained" onPress={onRefresh} loading={isRefetching}>
          {t('system.retry')}
        </Button>
      </View>
    );
  }

  if (!data?.length || data.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <MaterialCommunityIcons
          name="calendar-blank"
          size={48}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="titleMedium" style={{ marginTop: 16 }}>
          {t('system.notFound')}
        </Text>
        <Button
          mode="outlined"
          style={{ marginTop: 16 }}
          onPress={onRefresh}
          loading={isRefetching}
        >
          {t('system.refresh')}
        </Button>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      <Text
        variant="titleLarge"
        style={[styles.header, { color: theme.colors.onSurface }]}
      >
        {t('system.myServices')} ({data.length})
      </Text>
      <View style={styles.cardsContainer}>
        {data.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  cardsContainer: {
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  pageText: {
    marginHorizontal: 16,
  },
});

export default MyServicesPage;