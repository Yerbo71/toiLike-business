import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';

export const EmptyView = () => {
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
      <Text>{t('system.notFound')}</Text>
    </View>
  );
};
