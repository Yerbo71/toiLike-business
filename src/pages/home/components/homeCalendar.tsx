import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Card, Text, useTheme } from 'react-native-paper';

interface DailyEventSummaryDto {
  date: string;
  pendingCount: number;
  confirmedCount: number;
  rejectedCount: number;
  sumCost: number;
}

interface HomeChartsProps {
  data: DailyEventSummaryDto[];
}

export const HomeCalendar: React.FC<HomeChartsProps> = ({ data }) => {
  const theme = useTheme();

  const markedDates = data.reduce((acc, item) => {
    const hasEvents =
      item.confirmedCount > 0 ||
      item.rejectedCount > 0 ||
      item.pendingCount > 0;

    acc[item.date] = {
      selected: true,
      marked: hasEvents,
      selectedColor: theme.colors.primary,
      dotColor: theme.colors.secondary,
      customData: {
        confirmed: item.confirmedCount,
        rejected: item.rejectedCount,
        pending: item.pendingCount,
        sumCost: item.sumCost,
      },
    };
    return acc;
  }, {} as any);

  const renderDay = (day: any) => {
    const dateStr = day.date.dateString;
    const dayData = markedDates[dateStr]?.customData;

    return (
      <View style={styles.dayContainer}>
        <Text style={[styles.dayText, { color: theme.colors.onSurface }]}>
          {day.day}
        </Text>
        {dayData && (
          <View style={styles.eventIndicators}>
            {dayData.confirmed > 0 && (
              <View style={[styles.indicator, styles.confirmedIndicator]}>
                <Text style={styles.indicatorText}>{dayData.confirmed}</Text>
              </View>
            )}
            {dayData.rejected > 0 && (
              <View style={[styles.indicator, styles.rejectedIndicator]}>
                <Text style={styles.indicatorText}>{dayData.rejected}</Text>
              </View>
            )}
            {dayData.pending > 0 && (
              <View style={[styles.indicator, styles.pendingIndicator]}>
                <Text style={styles.indicatorText}>{dayData.pending}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderHeader = (date: any) => {
    const month = date.toString('MMMM yyyy');
    return (
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          {month}
        </Text>
      </View>
    );
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: theme.colors.surface,
            calendarBackground: theme.colors.surface,
            textSectionTitleColor: theme.colors.onSurface,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.onPrimary,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.onSurface,
            textDisabledColor: theme.colors.outline,
            arrowColor: theme.colors.primary,
            monthTextColor: theme.colors.onSurface,
            indicatorColor: theme.colors.primary,
            textDayFontFamily: 'regular',
            textMonthFontFamily: 'medium',
            textDayHeaderFontFamily: 'medium',
          }}
          markedDates={markedDates}
          dayComponent={renderDay}
          renderHeader={renderHeader}
          hideExtraDays
          firstDay={1}
          enableSwipeMonths
        />

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.confirmedLegend]} />
            <Text style={{ color: theme.colors.onSurface }}>Confirmed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.rejectedLegend]} />
            <Text style={{ color: theme.colors.onSurface }}>Rejected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.pendingLegend]} />
            <Text style={{ color: theme.colors.onSurface }}>Pending</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 8,
  },
  calendar: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  dayText: {
    fontSize: 14,
  },
  header: {
    padding: 10,
    alignItems: 'center',
  },
  eventIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  indicatorText: {
    fontSize: 8,
    color: 'white',
  },
  confirmedIndicator: {
    backgroundColor: '#4CAF50',
  },
  rejectedIndicator: {
    backgroundColor: '#F44336',
  },
  pendingIndicator: {
    backgroundColor: '#FFC107',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  confirmedLegend: {
    backgroundColor: '#4CAF50',
  },
  rejectedLegend: {
    backgroundColor: '#F44336',
  },
  pendingLegend: {
    backgroundColor: '#FFC107',
  },
});
