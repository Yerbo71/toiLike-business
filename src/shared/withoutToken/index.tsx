import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useI18n } from '@/src/context/LocaleContext';

export const WithoutToken = () => {
  const { t } = useI18n();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <Text variant="titleMedium">{t('withoutToken.title')}</Text>
      <Text variant="bodyMedium">{t('withoutToken.description')}</Text>
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
        {t('withoutToken.loginButton')}
      </Button>
    </View>
  );
};
