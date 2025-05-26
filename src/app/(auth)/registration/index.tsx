import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, useTheme, Surface, RadioButton } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { CTextInput } from '@/src/shared';
import { signUp, SignUpRequest } from '@/src/core/rest/auth/sign-up';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '@/src/context/LocaleContext';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  buzType: 'TOO' | 'IP';
};

export default function Registration() {
  const theme = useTheme();
  const [isPending, setIsPending] = useState(false);
  const { t } = useI18n();
  const { control, handleSubmit, watch, reset,setValue } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      buzType: 'IP',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    try {
      const { confirmPassword, ...rest } = data;
      const requestData: SignUpRequest = { ...rest, role: 'ROLE_BUSINESS' };
      const response = await signUp(requestData);
      Toast.show({
        type: 'success',
        text1: t('registrationPage.successTitle'),
        text2: response.message || t('registrationPage.successSubtitle'),
      });
      reset();
      router.push({
        pathname: '/(auth)/confirm-email',
        params: { email: data.email },
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('registrationPage.errorTitle'),
        text2: (err as Error).message,
      });
      console.log('registration error', err);
    } finally {
      setIsPending(false);
    }
  };

  const gradientColors: [string, string] = [
    theme.dark ? 'rgba(186, 0, 86, 0.8)' : 'rgba(240, 64, 129, 0.7)',
    theme.dark ? 'rgba(118, 64, 0, 0.8)' : 'rgba(255, 145, 0, 0.7)',
  ];

  return (
    <View style={{...styles.backgroundContainer, backgroundColor: theme.colors.background}}>
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
                textAlign: 'center',
              }}
            >
              {t('registrationPage.title')}
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
              {t('registrationPage.subtitle')}
            </Text>
          </View>

          <View style={styles.inputsContainer}>
            <CTextInput
              control={control}
              name="username"
              label={t('registrationPage.username')}
              rules={{
                required: t('registrationPage.usernameRequired'),
                minLength: {
                  value: 4,
                  message: t('registrationPage.usernameMin'),
                },
              }}
            />
            <CTextInput
              control={control}
              name="email"
              label={t('registrationPage.email')}
              rules={{
                required: t('registrationPage.emailRequired'),
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: t('registrationPage.emailInvalid'),
                },
              }}
            />
            <CTextInput
              control={control}
              name="password"
              label={t('registrationPage.password')}
              secureTextEntry
              rules={{
                required: t('registrationPage.passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('registrationPage.passwordMin'),
                },
              }}
            />
            <CTextInput
              control={control}
              name="confirmPassword"
              label={t('registrationPage.confirmPassword')}
              secureTextEntry
              rules={{
                required: t('registrationPage.confirmPasswordRequired'),
                validate: (value: string | undefined) =>
                  value === watch('password') ||
                  t('registrationPage.passwordsDontMatch'),
              }}
            />
          </View>

          <View >
            <Text style={{...styles.radioGroupLabel,
              color: theme.dark
                ? theme.colors.onSurface
                : theme.colors.onSurfaceVariant,}}>
              {t('registrationPage.businessType')}
            </Text>
            <View style={styles.radioButtonsContainer}>
              <View style={styles.radioButtonItem}>
                <RadioButton
                  value="TOO"
                  status={watch('buzType') === 'TOO' ? 'checked' : 'unchecked'}
                  onPress={() => setValue('buzType', 'TOO')}
                  color={theme.colors.primary}
                />
                <Text onPress={() => control._formValues.buzType = 'TOO'}>
                  {t('registrationPage.businessTypeTOO')}
                </Text>
              </View>
              <View style={styles.radioButtonItem}>
                <RadioButton
                  value="IP"
                  status={watch('buzType') === 'IP' ? 'checked' : 'unchecked'}
                  onPress={() => setValue('buzType', 'IP')}
                  color={theme.colors.primary}
                />
                <Text onPress={() => control._formValues.buzType = 'IP'}>
                  {t('registrationPage.businessTypeIP')}
                </Text>
              </View>
            </View>
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
            {isPending
              ? t('registrationPage.creatingAccount')
              : t('registrationPage.createAccount')}
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
            {t('registrationPage.alreadyHaveAccount')}
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
    paddingHorizontal: 20,
  },
  radioGroupLabel: {
    fontSize: 16,
    marginLeft: 4,
  },
  radioButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 4,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
