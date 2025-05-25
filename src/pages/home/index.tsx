import React from 'react';
import { ScrollView } from 'react-native';
import HomeHeader from '@/src/pages/home/components/homeHeader';

const HomePage = () => {
  return (
    <ScrollView stickyHeaderIndices={[0]}>
      <HomeHeader />
    </ScrollView>
  );
};

export default HomePage;
