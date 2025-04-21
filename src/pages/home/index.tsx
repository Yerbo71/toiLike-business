import React from 'react';
import { Image, ScrollView } from 'react-native';
import HomeSearchBar from '@/src/pages/home/components/homeSearchBar';
import HomeCarousel from '@/src/pages/home/components/homeCarousel';
import HomeEventBlock from '@/src/pages/home/components/homeEventBlock';

const HomePage = () => {
  return (
    <ScrollView>
      <HomeSearchBar />
      <HomeCarousel />
      <HomeEventBlock />
    </ScrollView>
  );
};

export default HomePage;
