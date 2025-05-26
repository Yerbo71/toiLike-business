import React, { useContext, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, useTheme, Surface } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { CTextInput } from '@/src/shared';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '@/src/context/LocaleContext';
import { confirmResetCode } from '@/src/core/rest/auth';
import { AuthContext } from '@/src/context/AuthContext';
import { useLocalSearchParams } from 'expo-router';

export default function ConfirmResetCode() {
  const theme = useTheme();
  const { t } = useI18n();
  const { control, handleSubmit, watch } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [isPending, setIsPending] = useState(false);
  const { user } = useContext(AuthContext);
  const params = useLocalSearchParams();
  const emailParams = typeof params.email === 'string' ? params.email : '';
  const email = emailParams || user?.email || '';

  const onSubmit = async (data: {
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: t('resetPassword.errorTitle'),
        text2: t('resetPassword.passwordsNotMatch'),
      });
      return;
    }
    setIsPending(true);
    try {
      const response = await confirmResetCode(
        { email },
        {
          code: data.code,
          newPassword: data.newPassword,
        },
      );
      Toast.show({
        type: 'success',
        text1: t('resetPassword.successTitle'),
        text2: response.message || t('resetPassword.successMessage'),
      });

      setTimeout(() => {
        router.push('/(auth)/login');
      }, 1000);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('resetPassword.errorTitle'),
        text2: (err as Error).message || t('resetPassword.errorMessage'),
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
              {t('resetPassword.title')}
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
              {t('resetPassword.description')} {email}
            </Text>
          </View>

          <View style={styles.inputsContainer}>
            <CTextInput
              control={control}
              name="code"
              label={t('resetPassword.codeLabel')}
              rules={{
                required: t('resetPassword.codeRequired'),
              }}
            />

            <CTextInput
              control={control}
              name="newPassword"
              label={t('resetPassword.newPasswordLabel')}
              secureTextEntry
              rules={{
                required: t('resetPassword.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('resetPassword.passwordMinLength'),
                },
              }}
            />

            <CTextInput
              control={control}
              name="confirmPassword"
              label={t('resetPassword.confirmPasswordLabel')}
              secureTextEntry
              rules={{
                required: t('resetPassword.confirmPasswordRequired'),
                validate: (value: string) =>
                  value === watch('newPassword') ||
                  t('resetPassword.passwordsNotMatch'),
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
            {t('resetPassword.resetButton')}
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
            {t('resetPassword.noAccount')}
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
