import React from 'react';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card, useTheme } from 'react-native-paper';

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

const COLORS = {
  CONFIRMED: '#00C853',
  REJECTED: '#FF3D00',
  PENDING: '#FFAB00',
  BACKGROUND: '#F5F5F5',
};

const MIN_VALUE = 0.1;

export const HomePieChart: React.FC<HomeChartsProps> = ({ data }) => {
  const theme = useTheme();
  if (!data || data.length === 0) {
    return null;
  }

  const { confirmedCount, rejectedCount, pendingCount } = data[0];
  const total = confirmedCount + rejectedCount + pendingCount;

  const showPlaceholders = total === 0;

  const chartData = [
    {
      name: 'Confirmed',
      population: showPlaceholders
        ? MIN_VALUE
        : Math.max(confirmedCount, MIN_VALUE),
      color: COLORS.CONFIRMED,
      legendFontColor: theme.dark
        ? theme.colors.onSurface
        : theme.colors.onSurfaceVariant,
      legendFontSize: 12,
    },
    {
      name: 'Rejected',
      population: showPlaceholders
        ? MIN_VALUE
        : Math.max(rejectedCount, MIN_VALUE),
      color: COLORS.REJECTED,
      legendFontColor: theme.dark
        ? theme.colors.onSurface
        : theme.colors.onSurfaceVariant,
      legendFontSize: 12,
    },
    {
      name: 'Pending',
      population: showPlaceholders
        ? MIN_VALUE
        : Math.max(pendingCount, MIN_VALUE),
      color: COLORS.PENDING,
      legendFontColor: theme.dark
        ? theme.colors.onSurface
        : theme.colors.onSurfaceVariant,
      legendFontSize: 12,
    },
  ];

  return (
    <Card style={{ margin: 8 }}>
      <PieChart
        data={chartData}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={true}
        avoidFalseZero
      />
    </Card>
  );
};
