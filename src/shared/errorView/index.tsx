import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';

export const ErrorView = () => {
  const theme = useTheme();
  const { t } = useI18n();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ color: theme.colors.error }}>
        {t('system.failedLoad')}
      </Text>
    </View>
  );
};
