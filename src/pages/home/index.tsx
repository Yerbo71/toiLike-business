import React, { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import HomeHeader from '@/src/pages/home/components/homeHeader';
import { useQuery } from '@tanstack/react-query';
import { getDailySummary } from '@/src/core/rest/user-vendor-controller';
import { Button, Text, useTheme, TextInput, Surface } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HomePieChart } from '@/src/pages/home/components/homePieChart';
import { HomeBarChart } from '@/src/pages/home/components/homeBarChart';
import { HomeLineChart } from '@/src/pages/home/components/homeLineChart';
import { AuthContext } from '@/src/context/AuthContext';
import { HomeCalendar } from '@/src/pages/home/components/homeCalendar';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

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
  const { t, locale } = useI18n();
  const [selectedRange, setSelectedRange] = useState(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 15);

    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 15);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  });
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);

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

  const createSafeDate = (date?: Date | string | number) => {
    try {
      const d = date ? new Date(date) : new Date();
      return isNaN(d.getTime()) ? new Date() : d;
    } catch {
      return new Date();
    }
  };

  const formatDateTime = (date: Date) => ({
    dateStr: date.toLocaleDateString(locale === 'kz' ? 'ru-RU' : 'en-US'),
    timeStr: date.toLocaleTimeString(locale === 'kz' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    dateObj: date,
  });

  const handleStartDateChange = (date: Date) => {
    const current = formatDateTime(createSafeDate(selectedRange.startDate));
    const newDate = new Date(date);
    newDate.setHours(current.dateObj.getHours(), current.dateObj.getMinutes());
    setSelectedRange((prev) => ({
      ...prev,
      startDate: newDate.toISOString(),
    }));
  };

  const handleStartTimeChange = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    const current = formatDateTime(createSafeDate(selectedRange.startDate));
    const newDate = new Date(current.dateObj);
    newDate.setHours(hours, minutes);
    setSelectedRange((prev) => ({
      ...prev,
      startDate: newDate.toISOString(),
    }));
  };

  const handleEndDateChange = (date: Date) => {
    const current = formatDateTime(createSafeDate(selectedRange.endDate));
    const newDate = new Date(date);
    newDate.setHours(current.dateObj.getHours(), current.dateObj.getMinutes());
    setSelectedRange((prev) => ({
      ...prev,
      endDate: newDate.toISOString(),
    }));
  };

  const handleEndTimeChange = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    const current = formatDateTime(createSafeDate(selectedRange.endDate));
    const newDate = new Date(current.dateObj);
    newDate.setHours(hours, minutes);
    setSelectedRange((prev) => ({
      ...prev,
      endDate: newDate.toISOString(),
    }));
  };

  const startFormatted = formatDateTime(
    createSafeDate(selectedRange.startDate),
  );
  const endFormatted = formatDateTime(createSafeDate(selectedRange.endDate));

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
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <HomeHeader />
        <Surface style={styles.dateRangeContainer}>
          <Text style={styles.dateRangeTitle}>
            <MaterialCommunityIcons name="calendar-range" size={18} />
            {t('homePage.dateRange') || 'Date Range'}
          </Text>

          <Text style={styles.sectionLabel}>
            {t('homePage.startDate') || 'Start Date & Time'}
          </Text>

          <View style={styles.datetimeContainer}>
            <View style={styles.dateInput}>
              <TouchableOpacity onPress={() => setStartDatePickerVisible(true)}>
                <TextInput
                  theme={{ roundness: 10 }}
                  label={t('homePage.startDate') || 'Start Date'}
                  mode="outlined"
                  value={startFormatted.dateStr}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.timeInput}>
              <TouchableOpacity onPress={() => setStartTimePickerVisible(true)}>
                <TextInput
                  theme={{ roundness: 10 }}
                  label={t('homePage.startTime') || 'Start Time'}
                  mode="outlined"
                  value={startFormatted.timeStr}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionLabel}>
            {t('homePage.endDate') || 'End Date & Time'}
          </Text>

          <View style={styles.datetimeContainer}>
            <View style={styles.dateInput}>
              <TouchableOpacity onPress={() => setEndDatePickerVisible(true)}>
                <TextInput
                  theme={{ roundness: 10 }}
                  label={t('homePage.endDate') || 'End Date'}
                  mode="outlined"
                  value={endFormatted.dateStr}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.timeInput}>
              <TouchableOpacity onPress={() => setEndTimePickerVisible(true)}>
                <TextInput
                  theme={{ roundness: 10 }}
                  label={t('homePage.endTime') || 'End Time'}
                  mode="outlined"
                  value={endFormatted.timeStr}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Surface>

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
          </View>
        )}
      </ScrollView>

      {/* Date/Time Picker Modals */}
      <DatePickerModal
        locale={locale === 'kz' ? 'ru' : 'en'}
        mode="single"
        visible={startDatePickerVisible}
        onDismiss={() => setStartDatePickerVisible(false)}
        date={startFormatted.dateObj}
        onConfirm={({ date }) => {
          if (date) {
            handleStartDateChange(date);
          }
          setStartDatePickerVisible(false);
        }}
        validRange={{
          endDate: endFormatted.dateObj,
        }}
      />
      <TimePickerModal
        locale={locale}
        visible={startTimePickerVisible}
        onDismiss={() => setStartTimePickerVisible(false)}
        onConfirm={handleStartTimeChange}
        hours={startFormatted.dateObj.getHours()}
        minutes={startFormatted.dateObj.getMinutes()}
      />
      <DatePickerModal
        locale={locale === 'kz' ? 'ru' : 'en'}
        mode="single"
        visible={endDatePickerVisible}
        onDismiss={() => setEndDatePickerVisible(false)}
        date={endFormatted.dateObj}
        onConfirm={({ date }) => {
          if (date) {
            handleEndDateChange(date);
          }
          setEndDatePickerVisible(false);
        }}
        validRange={{
          startDate: startFormatted.dateObj,
        }}
      />
      <TimePickerModal
        locale={locale}
        visible={endTimePickerVisible}
        onDismiss={() => setEndTimePickerVisible(false)}
        onConfirm={handleEndTimeChange}
        hours={endFormatted.dateObj.getHours()}
        minutes={endFormatted.dateObj.getMinutes()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    width: '100%',
  },
  containerChart: {
    flex: 1,
    alignItems: 'center',
    marginTop: 12,
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
  dateRangeContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  dateRangeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
    color: '#666',
  },
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  dateInput: {
    flex: 2,
  },
  timeInput: {
    flex: 1,
  },
});

export default HomePage;
