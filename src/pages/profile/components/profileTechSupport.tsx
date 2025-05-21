import React, { useState } from 'react';
import { Surface } from 'react-native-paper';
import { ChevronButton } from '@/src/shared/chevronButton';
import { useTheme } from '@/src/context/ThemeContext';
import { useI18n } from '@/src/context/LocaleContext';
import {
  TechSupportModal,
  AboutAppModal,
  RatingModal,
} from './modals/profileModals';
import { router } from 'expo-router';

const ProfileTechSupport = () => {
  const { setThemeMode, themeMode } = useTheme();
  const { t } = useI18n();
  const [techSupportVisible, setTechSupportVisible] = useState(false);
  const [aboutAppVisible, setAboutAppVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);

  const toggleThemeMode = () => {
    const nextMode =
      themeMode === 'System'
        ? 'Light'
        : themeMode === 'Light'
          ? 'Dark'
          : 'System';
    setThemeMode(nextMode);
  };

  return (
    <>
      <Surface
        style={{
          padding: 10,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        <ChevronButton
          leftIcon="account-wrench"
          leftTitle={t('system.techSupport')}
          rightIcon="chevron-right"
          rightTitle={t('system.choose')}
          onPress={() => setTechSupportVisible(true)}
        />
        <ChevronButton
          leftIcon="application-braces"
          leftTitle={t('system.aboutApp')}
          rightIcon="chevron-right"
          rightTitle={t('system.choose')}
          onPress={() => setAboutAppVisible(true)}
        />
        <ChevronButton
          leftIcon="progress-star"
          leftTitle={t('system.rating')}
          rightIcon="chevron-right"
          rightTitle={t('system.choose')}
          onPress={() => setRatingVisible(true)}
        />
        <ChevronButton
          leftIcon="theme-light-dark"
          leftTitle={t('system.theme')}
          rightIcon="chevron-right"
          rightTitle={themeMode}
          onPress={toggleThemeMode}
        />
        <ChevronButton
          leftIcon="lock-reset"
          leftTitle={t('system.resetPassword')}
          rightIcon="chevron-right"
          onPress={() => {
            router.push('/(auth)/send-reset-code');
          }}
        />
      </Surface>

      <TechSupportModal
        visible={techSupportVisible}
        onDismiss={() => setTechSupportVisible(false)}
      />

      <AboutAppModal
        visible={aboutAppVisible}
        onDismiss={() => setAboutAppVisible(false)}
      />

      <RatingModal
        visible={ratingVisible}
        onDismiss={() => setRatingVisible(false)}
      />
    </>
  );
};

export default ProfileTechSupport;
