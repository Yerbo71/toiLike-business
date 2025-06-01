import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Card, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';

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

const screenWidth = Dimensions.get('window').width;

export const HomeBarChart: React.FC<HomeChartsProps> = ({ data }) => {
  const { t } = useI18n();
  const theme = useTheme();
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card style={{ margin: 8 }}>
      <BarChart
        data={{
          labels: [
            t('system.confirmed'),
            t('system.rejected'),
            t('system.pending'),
          ],
          datasets: [
            {
              data: [
                data[0].confirmedCount,
                data[0].rejectedCount,
                data[0].pendingCount,
              ],
            },
          ],
        }}
        width={screenWidth * 0.9}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        flatColor
        chartConfig={{
          backgroundColor: theme.colors.elevation.level2,
          backgroundGradientFrom: theme.colors.elevation.level1,
          backgroundGradientTo: theme.colors.elevation.level1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
          barRadius: 5,
          labelColor: (opacity = 1) =>
            theme.dark
              ? `rgba(${theme.colors.onSurface}, ${opacity})`
              : `rgba(${theme.colors.onSurfaceVariant}, ${opacity})`,
        }}
        verticalLabelRotation={0}
      />
    </Card>
  );
};
