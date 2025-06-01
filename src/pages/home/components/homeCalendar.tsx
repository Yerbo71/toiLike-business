import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Card, Text, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { formatDate, SupportedLocale } from '@/src/core/utils';

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

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
  dayNames: [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};

LocaleConfig.locales['kz'] = {
  monthNames: [
    'Қаңтар',
    'Ақпан',
    'Наурыз',
    'Сәуір',
    'Мамыр',
    'Маусым',
    'Шілде',
    'Тамыз',
    'Қыркүйек',
    'Қазан',
    'Қараша',
    'Желтоқсан',
  ],
  monthNamesShort: [
    'Қаң',
    'Ақп',
    'Нау',
    'Сәу',
    'Мам',
    'Мау',
    'Шіл',
    'Там',
    'Қыр',
    'Қаз',
    'Қар',
    'Жел',
  ],
  dayNames: [
    'Жексенбі',
    'Дүйсенбі',
    'Сейсенбі',
    'Сәрсенбі',
    'Бейсенбі',
    'Жұма',
    'Сенбі',
  ],
  dayNamesShort: ['Жк', 'Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн'],
  today: 'Бүгін',
};

export const HomeCalendar: React.FC<HomeChartsProps> = ({ data }) => {
  const theme = useTheme();
  const { locale, t } = useI18n();

  const markedDates = data.reduce((acc, item) => {
    const hasEvents =
      item.confirmedCount > 0 ||
      item.rejectedCount > 0 ||
      item.pendingCount > 0;

    if (hasEvents) {
      acc[item.date] = {
        marked: true,
        dotColor: '#4CAF50',
        selectedColor: theme.colors.primary,
        dots: [
          ...(item.confirmedCount > 0
            ? [{ key: 'confirmed', color: '#4CAF50' }]
            : []),
          ...(item.rejectedCount > 0
            ? [{ key: 'rejected', color: '#F44336' }]
            : []),
          ...(item.pendingCount > 0
            ? [{ key: 'pending', color: '#FFC107' }]
            : []),
        ],
        customData: {
          confirmed: item.confirmedCount,
          rejected: item.rejectedCount,
          pending: item.pendingCount,
          sumCost: item.sumCost,
        },
      };
    }
    return acc;
  }, {} as any);

  const onDayPress = (day: any) => {
    const dayData = markedDates[day.dateString]?.customData;
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
          markingType={'multi-dot'}
          onDayPress={onDayPress}
          renderHeader={renderHeader}
          hideExtraDays
          firstDay={1}
          enableSwipeMonths
          current={new Date().toISOString().split('T')[0]}
        />

        <View style={styles.summaryContainer}>
          {data.map((item) => (
            <View key={item.date} style={styles.summaryItem}>
              <Text
                style={[styles.summaryDate, { color: theme.colors.onSurface }]}
              >
                {formatDate(item.date, locale as SupportedLocale)}
              </Text>
              <View style={styles.summaryStats}>
                {item.confirmedCount > 0 && (
                  <View style={[styles.statItem, styles.confirmedStat]}>
                    <Text style={styles.statText}>✓ {item.confirmedCount}</Text>
                  </View>
                )}
                {item.rejectedCount > 0 && (
                  <View style={[styles.statItem, styles.rejectedStat]}>
                    <Text style={styles.statText}>✗ {item.rejectedCount}</Text>
                  </View>
                )}
                {item.pendingCount > 0 && (
                  <View style={[styles.statItem, styles.pendingStat]}>
                    <Text style={styles.statText}>⏳ {item.pendingCount}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.confirmedLegend]} />
            <Text style={{ color: theme.colors.onSurface }}>
              {t('system.confirmed')}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.rejectedLegend]} />
            <Text style={{ color: theme.colors.onSurface }}>
              {t('system.rejected')}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.pendingLegend]} />
            <Text style={{ color: theme.colors.onSurface }}>
              {t('system.pending')}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 2,
    marginHorizontal: 16,
  },
  calendar: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 10,
    alignItems: 'center',
  },
  summaryContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  confirmedStat: {
    backgroundColor: '#4CAF50',
  },
  rejectedStat: {
    backgroundColor: '#F44336',
  },
  pendingStat: {
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
