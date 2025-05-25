import React from 'react';
import { Stack } from 'expo-router';

const OrderLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: '',
      }}
    >
      <Stack.Screen name="staffOrdering/index" options={{ headerTitle: '' }} />
      <Stack.Screen name="cityChoose/index" options={{ headerTitle: '' }} />
      <Stack.Screen name="vendorCreate/index" options={{ headerTitle: '' }} />
      <Stack.Screen name="placeChoose/index" options={{ headerTitle: '' }} />
      <Stack.Screen name="vendorsChoose/index" options={{ headerTitle: '' }} />
    </Stack>
  );
};

export default OrderLayout;
