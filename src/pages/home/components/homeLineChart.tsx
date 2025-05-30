import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

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
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View>
      {data.length > 1 && (
        <View style={styles.chartContainer}>
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
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier
          />
        </View>
      )}
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
