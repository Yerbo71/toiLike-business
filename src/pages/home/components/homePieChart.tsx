import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

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

export const HomePieChart: React.FC<HomeChartsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.chartContainer}>
      <PieChart
        data={[
          {
            name: 'Confirmed',
            population: data[0].confirmedCount,
            color: '#4CAF50',
            legendFontColor: '#7F7F7F',
          },
          {
            name: 'Rejected',
            population: data[0].rejectedCount,
            color: '#F44336',
            legendFontColor: '#7F7F7F',
          },
          {
            name: 'Pending',
            population: data[0].pendingCount,
            color: '#FFC107',
            legendFontColor: '#7F7F7F',
          },
        ]}
        width={screenWidth * 0.9}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        absolute
        paddingLeft="15"
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
