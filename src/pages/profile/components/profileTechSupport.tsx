import React from 'react';
import { Surface } from 'react-native-paper';
import { ChevronButton } from '@/src/shared/chevronButton';
import { useTheme } from '@/src/context/ThemeContext';
import { useI18n } from '@/src/context/LocaleContext';

const ProfileTechSupport = () => {
  const { setThemeMode, themeMode } = useTheme();
  const { t } = useI18n();

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
      />
      <ChevronButton
        leftIcon="application-braces"
        leftTitle={t('system.aboutApp')}
        rightIcon="chevron-right"
        rightTitle={t('system.choose')}
      />
      <ChevronButton
        leftIcon="progress-star"
        leftTitle={t('system.rating')}
        rightIcon="chevron-right"
        rightTitle={t('system.choose')}
      />
      <ChevronButton
        leftIcon="theme-light-dark"
        leftTitle={t('system.theme')}
        rightIcon="chevron-right"
        rightTitle={themeMode}
        onPress={toggleThemeMode}
      />
    </Surface>
  );
};

export default ProfileTechSupport;
