import React from 'react';
import { Stack } from 'expo-router';

const OrderLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: '',
      }}
    >
      <Stack.Screen name="staffOrdering" options={{ headerTitle: '' }} />
      <Stack.Screen name="countryChoose" options={{ headerTitle: '' }} />
      <Stack.Screen name="manualOrdering" options={{ headerTitle: '' }} />
      <Stack.Screen name="hallChoose" options={{ headerTitle: '' }} />
    </Stack>
  );
};

export default OrderLayout;
