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
  inputType?: import('react-native').KeyboardTypeOptions;
  editable?: boolean;
}

export const CTextInput: React.FC<CTextInputProps> = ({
  control,
  name,
  label,
  rules,
  multiline,
  secureTextEntry,
  inputType,
  editable,
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
        }) => {
          const formattedValue = Array.isArray(value)
            ? value.map((item) => item.id).join(', ')
            : typeof value === 'object'
              ? value.id
              : String(value || '');
          return (
            <>
              <TextInput
                label={label}
                mode="outlined"
                value={formattedValue}
                editable={editable}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!error}
                theme={{ roundness: 10 }}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                secureTextEntry={secureTextEntry && !show}
                keyboardType={inputType || 'default'}
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
          );
        }}
      />
    </View>
  );
};
