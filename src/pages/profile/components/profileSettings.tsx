import React, { useState } from 'react';
import { Menu, Surface, useTheme } from 'react-native-paper';
import { ChevronButton } from '@/src/shared/chevronButton';
import { useI18n } from '@/src/context/LocaleContext';
import { router } from 'expo-router';
import { useEvent } from '@/src/context/EventContext';

const ProfileSettings = () => {
  const { locale, setLocale, t } = useI18n();
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();
  const stringLocale =
    locale === 'ru' ? 'Русский' : locale === 'kz' ? 'Қазақша' : 'English';
  const { event } = useEvent();

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale);
    closeMenu();
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
        leftIcon="city"
        leftTitle={t('system.city')}
        rightIcon="chevron-right"
        rightTitle={event.city || t('system.choose')}
        onPress={() => {
          router.push('/(ordering)/countryChoose');
        }}
      />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchorPosition="bottom"
        style={{
          right: 10,
          left: 10,
        }}
        anchor={
          <ChevronButton
            leftIcon="ab-testing"
            leftTitle={t('system.language')}
            rightIcon="chevron-right"
            rightTitle={stringLocale}
            onPress={toggleMenu}
          />
        }
      >
        <Menu.Item onPress={() => changeLanguage('ru')} title="Русский" />
        <Menu.Item onPress={() => changeLanguage('kz')} title="Қазақша" />
        <Menu.Item onPress={() => changeLanguage('en')} title="English" />
      </Menu>
      <ChevronButton
        leftIcon="bell"
        leftTitle={t('system.notifications')}
        isToggled
      />
    </Surface>
  );
};

export default ProfileSettings;
