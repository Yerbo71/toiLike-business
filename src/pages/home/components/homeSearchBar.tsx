import React from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Searchbar } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';

const HomeSearchBar = () => {
  const { t } = useI18n();
  const { control } = useForm({
    defaultValues: {
      search: '',
    },
  });
  return (
    <View
      style={{
        padding: 15,
      }}
    >
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Searchbar
            placeholder={t('system.search')}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="search"
      />
    </View>
  );
};

export default HomeSearchBar;
