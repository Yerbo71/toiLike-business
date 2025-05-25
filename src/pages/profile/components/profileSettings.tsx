import React, { useState } from 'react';
import { Menu, Surface } from 'react-native-paper';
import { ChevronButton } from '@/src/shared/chevronButton';
import { useI18n } from '@/src/context/LocaleContext';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useGlobalFilters } from '@/src/context/GlobalFilterContext';

const ProfileSettings = () => {
  const { locale, setLocale, t } = useI18n();
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const stringLocale =
    locale === 'ru' ? 'Русский' : locale === 'kz' ? 'Қазақша' : 'English';
  const { city } = useGlobalFilters();

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale);
    closeMenu();
  };

  const toggleNotifications = async () => {
    try {
      setNotificationsEnabled(!notificationsEnabled);
      if (!notificationsEnabled) {
        Alert.alert(
          t('notifications.enabled'),
          t('notifications.enabledMessage'),
          [{ text: t('system.ok') }],
        );
      } else {
        Alert.alert(
          t('notifications.disabled'),
          t('notifications.disabledMessage'),
          [{ text: t('system.ok') }],
        );
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert(t('system.error'), t('notifications.toggleError'));
    }
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
        rightTitle={city || t('system.choose')}
        onPress={() => {
          router.push('/(protected)/(flow)/cityChoose');
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
        isToggled={true}
        onPress={toggleNotifications}
        isSwitchOn={notificationsEnabled}
        onToggleSwitch={toggleNotifications}
      />
    </Surface>
  );
};

export default ProfileSettings;
