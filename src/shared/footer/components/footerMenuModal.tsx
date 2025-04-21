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
          <Text variant="titleMedium">{t('system.order')}</Text>
          <IconButton icon="close" onPress={close} />
        </View>
        <TouchableOpacity
          onPress={() => {
            close();
            router.push('/(ordering)/manualOrdering');
          }}
        >
          <Card.Title
            title={t('orderModal.orderOne.title')}
            subtitle={t('orderModal.orderOne.description')}
            left={(props) => <Avatar.Icon {...props} icon="list-status" />}
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
            router.push('/(ordering)/staffOrdering');
          }}
        >
          <Card.Title
            title={t('orderModal.orderTwo.title')}
            subtitle={t('orderModal.orderTwo.description')}
            left={(props) => <Avatar.Icon {...props} icon="account-star" />}
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
            router.push('/chats');
          }}
        >
          <Card.Title
            title={t('orderModal.orderThree.title')}
            subtitle={t('orderModal.orderThree.description')}
            left={(props) => <Avatar.Icon {...props} icon="robot-happy" />}
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
