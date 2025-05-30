import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

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
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.chartContainer}>
      <BarChart
        data={{
          labels: ['Confirmed', 'Rejected', 'Pending'],
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
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
        }}
        verticalLabelRotation={0}
        fromZero
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
