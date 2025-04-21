import React, { useContext, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, useTheme, Surface } from 'react-native-paper';
import { AuthContext } from '@/src/context/AuthContext';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { CTextInput } from '@/src/shared';
import { login } from '@/src/core/rest/auth/login-in';
import Toast from 'react-native-toast-message';
import type { components } from '@/src/types/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const theme = useTheme();
  const { control, handleSubmit } = useForm<
    components['schemas']['LoginInRequest']
  >({
    mode: 'onSubmit',
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: components['schemas']['LoginInRequest']) => {
    setIsPending(true);
    try {
      const response = await login(data);
      await signIn(response.accessToken);
      router.replace('/(application)');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
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
              Welcome Back!
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
              Please enter your details to continue
            </Text>
          </View>

          <View style={styles.inputsContainer}>
            <CTextInput
              control={control}
              name="usernameOrEmail"
              label="Username or email"
              rules={{
                required: 'Username or email is required',
                minLength: {
                  value: 4,
                  message: 'Username or email must be at least 4 characters',
                },
              }}
            />
            <CTextInput
              control={control}
              name="password"
              label="Password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              secureTextEntry
            />
            <Text
              variant="bodyMedium"
              style={{
                alignSelf: 'flex-end',
                fontWeight: 'bold',
                color: theme.colors.primary,
                marginTop: 5,
              }}
              onPress={() => {
                // @ts-ignore
                router.push('/(auth)/reset-password-email');
              }}
            >
              Forgot your password?
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            disabled={isPending}
            style={styles.signInButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Sign In
          </Button>

          <Text
            variant="bodyMedium"
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              color: theme.colors.tertiary,
              marginTop: 20,
            }}
            onPress={() => {
              router.push('/(auth)/registration');
            }}
          >
            Create new account
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
  },
  formContainer: {
    width: width > 500 ? 450 : width * 0.85,
    padding: 25,
    borderRadius: 16,
    elevation: 4,
    justifyContent: 'center',
    gap: 20,
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
  signInButton: {
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
