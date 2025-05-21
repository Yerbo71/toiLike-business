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
import { useI18n } from '@/src/context/LocaleContext';

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const theme = useTheme();
  const { t } = useI18n();
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
              {t('loginPage.welcome')}
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
              {t('loginPage.instruction')}
            </Text>
          </View>

          <View style={styles.inputsContainer}>
            <CTextInput
              control={control}
              name="usernameOrEmail"
              label={t('loginPage.usernameOrEmail')}
              rules={{
                required: t('loginPage.usernameOrEmailRequired'),
                minLength: {
                  value: 4,
                  message: t('loginPage.usernameOrEmailMin'),
                },
              }}
            />
            <CTextInput
              control={control}
              name="password"
              label={t('loginPage.password')}
              rules={{
                required: t('loginPage.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('loginPage.passwordMin'),
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
                router.push('(auth)/send-reset-code');
              }}
            >
              {t('loginPage.forgotPassword')}
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
            {t('loginPage.signIn')}
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
            {t('loginPage.createAccount')}
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
