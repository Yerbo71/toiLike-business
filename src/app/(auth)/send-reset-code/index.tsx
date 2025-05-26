import React, { useContext, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, useTheme, Surface } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { CTextInput } from '@/src/shared';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '@/src/context/LocaleContext';
import { sendResetCode } from '@/src/core/rest/auth';
import { AuthContext } from '@/src/context/AuthContext';

export default function SendResetCode() {
  const theme = useTheme();
  const { t } = useI18n();
  const { user } = useContext(AuthContext);
  const email = user?.email || '';
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: email,
    },
  });
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    setIsPending(true);
    try {
      const response = await sendResetCode({ email: data.email });
      Toast.show({
        type: 'success',
        text1: t('resetPasswordEmail.emailSentTitle'),
        text2: response.message || t('resetPasswordEmail.emailSentMessage'),
      });
      router.push({
        pathname: '/(auth)/confirm-reset-code',
        params: { email: data.email },
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('resetPasswordEmail.errorTitle'),
        text2: (err as Error).message || t('resetPasswordEmail.errorMessage'),
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
              {t('resetPasswordEmail.resetTitle')}
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
              {t('resetPasswordEmail.resetDescription')}
            </Text>
          </View>

          <View style={styles.inputsContainer}>
            <CTextInput
              control={control}
              name="email"
              label={t('resetPasswordEmail.emailLabel')}
              rules={{
                required: t('resetPassword.emailRequired'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('resetPasswordEmail.invalidEmail'),
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
            {t('resetPasswordEmail.sendResetButton')}
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
            {t('resetPasswordEmail.noAccount')}
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
  disabledInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
