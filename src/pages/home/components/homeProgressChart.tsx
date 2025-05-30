import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

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

export const HomeProgressChart: React.FC<HomeChartsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const totalEvents =
    data[0].confirmedCount + data[0].rejectedCount + data[0].pendingCount;
  const successRate =
    totalEvents > 0 ? data[0].confirmedCount / totalEvents : 0;

  return (
    <View style={styles.chartContainer}>
      <ProgressChart
        data={{
          labels: ['Success'],
          data: [successRate],
        }}
        width={screenWidth * 0.9}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) =>
            opacity === 1 ? '#4CAF50' : `rgba(0, 0, 0, ${opacity})`,
        }}
        hideLegend={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 8,
  },
});
