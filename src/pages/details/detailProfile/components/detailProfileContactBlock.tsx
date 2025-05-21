import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { StyleSheet, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';

interface DetailProfileContactBlockProps {
  phoneNumber?: string;
  contactName?: string;
}

const DetailProfileContactBlock: React.FC<DetailProfileContactBlockProps> = ({
  phoneNumber,
  contactName = 'Events',
}) => {
  const { t } = useI18n();
  const theme = useTheme();

  const handleAddContact = async () => {
    if (!phoneNumber) {
      Alert.alert(t('detailsPage.error'), t('detailsPage.noPhoneNumber'));
      return;
    }

    try {
      // 1. Запрашиваем разрешения для Android и iOS
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          t('detailsPage.permissionDenied'),
          t('detailsPage.contactPermissionMessage'),
        );
        return;
      }

      // 2. Создаем контакт
      const newContact = {
        name: contactName,
        contactType: Contacts.ContactTypes.Person,
        phoneNumbers: [
          {
            label: 'work',
            number: phoneNumber,
          },
        ],
      };

      // 3. Добавляем контакт
      const contactId = await Contacts.addContactAsync(newContact);

      if (contactId) {
        Alert.alert(
          t('detailsPage.contactAdded'),
          t('detailsPage.contactAddedMessage'),
        );
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      Alert.alert(t('detailsPage.error'), t('detailsPage.contactAddError'));
    }
  };

  return (
    <Button
      mode="contained"
      icon="account-plus"
      style={[styles.messageButton, { backgroundColor: theme.colors.primary }]}
      labelStyle={styles.buttonLabel}
      onPress={handleAddContact}
    >
      {t('detailsPage.addToContacts')}
    </Button>
  );
};

const styles = StyleSheet.create({
  messageButton: {
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default DetailProfileContactBlock;
