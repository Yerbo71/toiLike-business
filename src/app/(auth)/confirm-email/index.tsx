import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, useTheme, Surface, TextInput } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { CTextInput } from '@/src/shared';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '@/src/context/LocaleContext';
import { confirmEmail } from '@/src/core/rest/auth/confirm-email';
import { useLocalSearchParams } from 'expo-router';

export default function ConfirmEmail() {
  const theme = useTheme();
  const { t } = useI18n();
  const params = useLocalSearchParams();
  const email = typeof params.email === 'string' ? params.email : '';
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      code: '',
    },
  });
  const [isPending, setIsPending] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const onSubmit = async (data: { code: string }) => {
    setIsPending(true);
    try {
      const response = await confirmEmail({ email }, { code: data.code });
      setEmailConfirmed(true);
      Toast.show({
        type: 'success',
        text1: t('confirmEmail.successTitle'),
        text2: response.message || t('confirmEmail.successMessage'),
      });
      setTimeout(() => {
        router.push('/(auth)/login');
      }, 500);
    }    catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || t('confirmEmail.errorMessage');

      Toast.show({
        type: 'error',
        text1: t('confirmEmail.errorTitle'),
        text2: errorMessage,
      });

      console.log('reset error', err);
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
              {emailConfirmed
                ? t('confirmEmail.confirmedTitle')
                : t('confirmEmail.title')}
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
              {emailConfirmed
                ? t('confirmEmail.confirmedDescription')
                : `${t('confirmEmail.description1')} ${email}`}
            </Text>
          </View>

          {!emailConfirmed ? (
            <>
              <View style={styles.inputsContainer}>
                <TextInput
                  label={t('confirmEmail.emailLabel')}
                  value={email}
                  disabled
                  style={styles.disabledInput}
                  mode="outlined"
                  theme={{ roundness: 10 }}
                />

                <CTextInput
                  control={control}
                  name="code"
                  label={t('confirmEmail.codeLabel')}
                  inputType="numeric"
                  rules={{
                    required: t('confirmEmail.codeRequired'),
                    minLength: {
                      value: 6,
                      message: t('confirmEmail.codeLength'),
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
                {t('confirmEmail.confirmButton')}
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => router.push('/(auth)/login')}
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {t('confirmEmail.goToLogin')}
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
            {t('confirmEmail.noAccount')}
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
