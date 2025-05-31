import React, { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import HomeHeader from '@/src/pages/home/components/homeHeader';
import { useQuery } from '@tanstack/react-query';
import { getDailySummary } from '@/src/core/rest/user-vendor-controller';
import { Button, Text, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HomePieChart } from '@/src/pages/home/components/homePieChart';
import { HomeBarChart } from '@/src/pages/home/components/homeBarChart';
import { HomeLineChart } from '@/src/pages/home/components/homeLineChart';
import { AuthContext } from '@/src/context/AuthContext';
import { HomeCalendar } from '@/src/pages/home/components/homeCalendar';

const MOCK_DATA = [
  {
    date: '2025-05-30',
    pendingCount: 0,
    confirmedCount: 0,
    rejectedCount: 0,
    sumCost: 0,
  },
  {
    date: '2025-05-29',
    pendingCount: 0,
    confirmedCount: 0,
    rejectedCount: 0,
    sumCost: 0,
  },
  {
    date: '2025-05-28',
    pendingCount: 0,
    confirmedCount: 0,
    rejectedCount: 0,
    sumCost: 0,
  },
];

const HomePage = () => {
  const theme = useTheme();
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
  const { t } = useI18n();
  const [selectedRange, setSelectedRange] = useState({
    startDate: '2025-05-20T17:00:36.625Z',
    endDate: '2025-05-30T17:00:36.625Z',
  });

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['dailySummary', selectedRange],
    queryFn: () =>
      getDailySummary(selectedRange.startDate, selectedRange.endDate),
    enabled: !!selectedRange.startDate && !!selectedRange.endDate,
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
        <ActivityIndicator
          animating={true}
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  if (isError) {
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

  return (
    <>
      <ScrollView
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <HomeHeader />
        <HomeCalendar
          data={data && data.length === 0 ? MOCK_DATA : data || MOCK_DATA}
        />
        {user?.subscription[0].subscription !== 'FREE' && (
          <View style={styles.containerChart}>
            <HomePieChart
              data={data && data.length === 0 ? MOCK_DATA : data || MOCK_DATA}
            />
            <HomeBarChart
              data={data && data.length === 0 ? MOCK_DATA : data || MOCK_DATA}
            />
            <HomeLineChart
              data={data && data.length === 0 ? MOCK_DATA : data || MOCK_DATA}
            />
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
    flex: 1,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  containerChart: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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

export default HomePage;
