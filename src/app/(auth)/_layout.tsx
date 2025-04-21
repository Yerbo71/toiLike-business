import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: '',
      }}
    >
      <Stack.Screen name="login" options={{ headerTitle: '' }} />
      <Stack.Screen name="registration" options={{ headerTitle: '' }} />
      <Stack.Screen name="reset-password-email" options={{ headerTitle: '' }} />
    </Stack>
  );
};

export default AuthLayout;
