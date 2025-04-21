import React from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Searchbar } from 'react-native-paper';

const HomeSearchBar = () => {
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
        render={({ field: { onChange, onBlur, value } }) => (
          <Searchbar
            placeholder="Search"
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
