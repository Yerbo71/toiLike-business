import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { useTheme } from 'react-native-paper';

interface CTextInputProps {
  control: any;
  name: string;
  label: string;
  rules?: object;
  multiline?: boolean;
  secureTextEntry?: boolean;
}

export const CTextInput: React.FC<CTextInputProps> = ({
  control,
  name,
  label,
  rules,
  multiline,
  secureTextEntry,
}) => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  return (
    <View>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              label={label}
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!error}
              theme={{ roundness: 10 }}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              secureTextEntry={secureTextEntry && !show}
              right={
                secureTextEntry ? (
                  <TextInput.Icon
                    icon={show ? 'eye' : 'eye-off'}
                    onPress={() => setShow(!show)}
                  />
                ) : undefined
              }
            />
            {error && (
              <Text
                style={{ color: theme.colors.error, marginTop: 5 }}
                variant="labelSmall"
              >
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};
