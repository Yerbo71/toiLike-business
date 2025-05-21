import { Redirect } from 'expo-router';
import { Slot } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {
  const { isAuthenticated,isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}