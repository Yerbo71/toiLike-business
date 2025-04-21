import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, useTheme, Surface } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { CTextInput } from '@/src/shared';
import { signUp, SignUpRequest } from '@/src/core/rest/auth/sign-up';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function Registration() {
  const theme = useTheme();
  const [isPending, setIsPending] = useState(false);
  const { control, handleSubmit, watch, reset } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    try {
      const { confirmPassword, ...rest } = data;
      const requestData: SignUpRequest = { ...rest, role: 'ROLE_USER' };
      await signUp(requestData);
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'You can now log in!',
      });
      reset();
      router.push('/(auth)/login');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: (err as Error).message,
      });
    } finally {
      setIsPending(false);
    }
  };

  const gradientColors: [string, string] = [
    theme.dark ? 'rgba(186, 0, 86, 0.8)' : 'rgba(240, 64, 129, 0.7)',
    theme.dark ? 'rgba(118, 64, 0, 0.8)' : 'rgba(255, 145, 0, 0.7)',
  ];

  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient colors={gradientColors} style={styles.gradientOverlay}>
        <Surface style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text
              variant="headlineMedium"
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                color: theme.colors.primary,
                marginBottom: 5,
              }}
            >
              Join Our Community
            </Text>
            <Text
              variant="titleMedium"
              style={{
                alignSelf: 'center',
                color: theme.dark
                  ? theme.colors.onSurface
                  : theme.colors.onSurfaceVariant,
                textAlign: 'center',
              }}
            >
              Create your account to discover amazing events
            </Text>
          </View>

          <View style={styles.inputsContainer}>
            <CTextInput
              control={control}
              name="username"
              label="Username"
              rules={{
                required: 'Username is required',
                minLength: {
                  value: 4,
                  message: 'Username must be at least 4 characters',
                },
              }}
            />
            <CTextInput
              control={control}
              name="email"
              label="Email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Enter a valid email',
                },
              }}
            />
            <CTextInput
              control={control}
              name="password"
              label="Password"
              secureTextEntry
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
            />
            <CTextInput
              control={control}
              name="confirmPassword"
              label="Confirm password"
              secureTextEntry
              rules={{
                required: 'Confirm Password is required',
                validate: (value: string | undefined) =>
                  value === watch('password') || 'Passwords do not match',
              }}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={isPending}
            style={styles.signUpButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            buttonColor={theme.colors.primary}
          >
            {isPending ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Text
            variant="bodyMedium"
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              color: theme.colors.tertiary,
              marginTop: 20,
            }}
            onPress={() => router.push('/(auth)/login')}
          >
            Already have an account? Sign In
          </Text>
        </Surface>
      </LinearGradient>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: width > 500 ? 480 : width * 0.9,
    padding: 25,
    borderRadius: 16,
    elevation: 4,
    justifyContent: 'center',
    gap: 25,
  },
  headerContainer: {
    gap: 10,
    marginBottom: 10,
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  signUpButton: {
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
