import React, { FC } from 'react';
import {
  Modal,
  Portal,
  Text,
  useTheme,
  IconButton,
  Card,
  Avatar,
} from 'react-native-paper';
import { View } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useI18n } from '@/src/context/LocaleContext';

interface Props {
  close: () => void;
}

const FooterMenuModal: FC<Props> = ({ close }) => {
  const theme = useTheme();
  const { t } = useI18n();
  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={close}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          padding: 15,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          gap: 10,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text variant="titleMedium">{t('system.createService')}</Text>
          <IconButton icon="close" onPress={close} />
        </View>
        <TouchableOpacity
          onPress={() => {
            close();
            // @ts-ignore
            router.push('/(protected)/(flow)/vendorCreate/index');
          }}
        >
          <Card.Title
            title={t('serviceCreateModal.vendorCreate.title')}
            subtitle={t('serviceCreateModal.vendorCreate.description')}
            left={(props) => <Avatar.Icon {...props} icon="account-cash" />}
            right={(props) => <IconButton {...props} icon="chevron-right" />}
            style={{
              borderStyle: 'solid',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: theme.colors.surfaceVariant,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            close();
            // @ts-ignore
            router.push('/(protected)/(flow)/placeCreate/index');
          }}
        >
          <Card.Title
            title={t('serviceCreateModal.placeCreate.title')}
            subtitle={t('serviceCreateModal.placeCreate.description')}
            left={(props) => <Avatar.Icon {...props} icon="fireplace-off" />}
            right={(props) => <IconButton {...props} icon="chevron-right" />}
            style={{
              borderStyle: 'solid',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: theme.colors.surfaceVariant,
            }}
          />
        </TouchableOpacity>
      </Modal>
    </Portal>
  );
};

export default FooterMenuModal;
