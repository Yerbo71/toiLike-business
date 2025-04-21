import React from 'react';
import { View, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';

const events = [
  {
    id: '1',
    name: 'Event 1',
    uri: require('../../../../assets/eventImages/Event_1.jpg'),
  },
  {
    id: '2',
    name: 'Event 2',
    uri: require('../../../../assets/eventImages/Event_2.jpg'),
  },
  {
    id: '3',
    name: 'Event 3',
    uri: require('../../../../assets/eventImages/Event_3.jpg'),
  },
  {
    id: '4',
    name: 'Event 4',
    uri: require('../../../../assets/eventImages/Event_4.jpg'),
  },
];
const HomeCarousel = () => {
  return (
    <View>
      <Carousel
        data={events}
        renderItem={({ item }) => <Card.Cover source={item.uri} />}
        sliderWidth={Dimensions.get('screen').width}
        itemWidth={380}
        vertical={false}
      />
    </View>
  );
};

export default HomeCarousel;
