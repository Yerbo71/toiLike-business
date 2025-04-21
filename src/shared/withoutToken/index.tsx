import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';

export const WithoutToken = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <Text variant="titleMedium">Log in to your account</Text>
      <Text variant="bodyMedium">Log in to view the data on this page.</Text>
      <Button
        mode="contained"
        onPress={() => {
          router.push('/(auth)/login');
        }}
        style={{
          width: 300,
          marginTop: 10,
        }}
      >
        Login
      </Button>
    </View>
  );
};
