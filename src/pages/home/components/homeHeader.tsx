import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Modal,
  Portal,
  Button,
} from 'react-native-paper';
import { useRouter } from 'expo-router';

const HomeHeader = () => {
  const theme = useTheme();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const notifications = [
    {
      id: 1,
      title: 'Welcome',
      message:
        'Thank you for joining our platform! We’re excited to have you on board.',
    },
    {
      id: 2,
      title: 'Start creating your event',
      message:
        'Begin by setting up your first event — choose a name, date, and invite participants!',
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <View style={styles.row}>
        <Text
          variant="titleMedium"
          style={[styles.logo, { color: theme.colors.primary }]}
        >
          ToiLike
        </Text>

        <View style={styles.iconsContainer}>
          <IconButton
            icon="bell-outline"
            size={24}
            onPress={showModal}
            style={styles.icon}
          />

          <IconButton
            icon="account-circle-outline"
            size={24}
            onPress={() => router.push('/profile')}
            style={styles.icon}
          />
        </View>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>
              Notifications
            </Text>

            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <Text variant="titleMedium">{notification.title}</Text>
                  <Text variant="bodyMedium">{notification.message}</Text>
                </View>
              ))
            ) : (
              <Text variant="bodyMedium">No new notifications</Text>
            )}

            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.modalButton}
            >
              Close
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 8,
  },
  modal: {
    padding: 20,
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  notificationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalButton: {
    marginTop: 16,
  },
});

export default HomeHeader;
