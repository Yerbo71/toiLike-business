import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
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

export const HomeLineChart: React.FC<HomeChartsProps> = ({ data }) => {
  const theme = useTheme();
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View>
      {data.length > 1 && (
        <Card style={{ margin: 8 }}>
          <LineChart
            data={{
              labels: data.map((item) =>
                new Date(item.date).getDate().toString(),
              ),
              datasets: [
                {
                  data: data.map((item) => item.sumCost),
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                },
              ],
            }}
            width={screenWidth * 0.9}
            height={200}
            chartConfig={{
              barRadius: 10,
              backgroundGradientFrom: theme.colors.elevation.level1,
              backgroundGradientTo: theme.colors.elevation.level1,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) =>
                theme.dark
                  ? `rgba(${theme.colors.onSurface}, ${opacity})`
                  : `rgba(${theme.colors.onSurfaceVariant}, ${opacity})`,
            }}
            bezier
          />
        </Card>
      )}
    </View>
  );
};
