import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, useTheme, Surface } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { CTextInput } from '@/src/shared';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResetPasswordEmail() {
  const theme = useTheme();
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });
  const [isPending, setIsPending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    setIsPending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);
      Toast.show({
        type: 'success',
        text1: 'Email Sent',
        text2: 'Password reset link has been sent to your email',
      });
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
              {emailSent ? 'Check Your Email' : 'Reset Password'}
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
              {emailSent
                ? `We've sent a password reset link to your email address. Please check your inbox.`
                : 'Enter your email to receive a password reset link'}
            </Text>
          </View>

          {!emailSent ? (
            <>
              <View style={styles.inputsContainer}>
                <CTextInput
                  control={control}
                  name="email"
                  label="Email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                />
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={isPending}
                disabled={isPending}
                style={styles.actionButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Send Reset Link
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => router.back()}
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Back to Login
            </Button>
          )}

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
            Don't have an account? Sign up
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
  actionButton: {
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
