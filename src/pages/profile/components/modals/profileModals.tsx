import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  IconButton,
  TextInput,
  List,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { Rating as RatingComponent } from 'react-native-ratings';

interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const TechSupportModal = ({ visible, onDismiss }: ModalProps) => {
  const { t } = useI18n();
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSendSupport = () => {
    setMessage('');
    setEmail('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
            style={styles.closeButton}
          />
          <Text style={styles.title}>{t('system.techSupport')}</Text>
        </View>
        <Divider />

        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>
            {t('profileModals.supportDescription')}
          </Text>

          <TextInput
            label={t('system.email')}
            value={email}
            onChangeText={setEmail}
            theme={{ roundness: 10 }}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
          />

          <TextInput
            label={t('system.message')}
            value={message}
            onChangeText={setMessage}
            theme={{ roundness: 10 }}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={6}
          />

          <List.Section>
            <List.Subheader>{t('profileModals.faq')}</List.Subheader>
            <List.Item
              title={t('profileModals.faqQuestion1')}
              description={t('profileModals.faqAnswer1')}
              left={(props) => <List.Icon {...props} icon="help-circle" />}
            />
            <List.Item
              title={t('profileModals.faqQuestion2')}
              description={t('profileModals.faqAnswer2')}
              left={(props) => <List.Icon {...props} icon="help-circle" />}
            />
          </List.Section>
        </ScrollView>

        <Divider />
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleSendSupport}
            style={styles.button}
          >
            {t('system.send')}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export const AboutAppModal = ({ visible, onDismiss }: ModalProps) => {
  const { t } = useI18n();
  const { colors } = useTheme();
  const appVersion = '1.0.0';

  const handleOpenWebsite = () => {
    Linking.openURL('https://ravee-website.com');
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
            style={styles.closeButton}
          />
          <Text style={styles.title}>{t('system.aboutApp')}</Text>
          <View style={styles.placeholder} />
        </View>
        <Divider />

        <ScrollView style={styles.content}>
          <View style={styles.appInfoContainer}>
            <IconButton
              icon="application-braces"
              size={64}
              style={styles.appIcon}
            />
            <Text style={styles.appName}>{t('profileModals.appName')}</Text>
            <Text style={styles.versionText}>v{appVersion}</Text>
          </View>

          <Divider style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>
            {t('profileModals.description')}
          </Text>
          <Text style={styles.paragraph}>
            {t('profileModals.appDescription')}
          </Text>

          <Divider style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>
            {t('profileModals.developedBy')}
          </Text>
          <Text style={styles.paragraph}>{t('profileModals.companyName')}</Text>

          <Divider style={styles.sectionDivider} />

          <List.Section>
            <List.Item
              title={t('profileModals.privacyPolicy')}
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Linking.openURL('https://your-privacy-policy.com')}
            />
            <List.Item
              title={t('profileModals.termsOfService')}
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() =>
                Linking.openURL('https://your-terms-of-service.com')
              }
            />
            <List.Item
              title={t('profileModals.website')}
              left={(props) => <List.Icon {...props} icon="web" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleOpenWebsite}
            />
          </List.Section>
        </ScrollView>

        <Divider />
        <View style={styles.footer}>
          <Button mode="contained" onPress={onDismiss} style={styles.button}>
            {t('system.close')}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export const RatingModal = ({ visible, onDismiss }: ModalProps) => {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmitRating = () => {
    setRating(0);
    setFeedback('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
            style={styles.closeButton}
          />
          <Text style={styles.title}>{t('system.rating')}</Text>
          <View style={styles.placeholder} />
        </View>
        <Divider />

        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>
            {t('profileModals.ratingDescription')}
          </Text>

          <View style={styles.ratingContainer}>
            <RatingComponent
              showRating
              onFinishRating={setRating}
              style={styles.rating}
              ratingCount={5}
              imageSize={40}
            />
          </View>

          <TextInput
            label={t('profileModals.feedback')}
            value={feedback}
            onChangeText={setFeedback}
            style={styles.input}
            theme={{ roundness: 10 }}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder={t('profileModals.feedbackPlaceholder')}
          />

          <View style={styles.storeRatingContainer}>
            <Text style={styles.storeRatingText}>
              {t('profileModals.rateOnStore')}
            </Text>
            <View style={styles.storeButtons}>
              <Button
                mode="outlined"
                icon="google-play"
                onPress={() => Linking.openURL('https://play.google.com')}
                style={styles.storeButton}
              >
                Play Store
              </Button>
              <Button
                mode="outlined"
                icon="apple"
                onPress={() => Linking.openURL('https://apps.apple.com')}
                style={styles.storeButton}
              >
                App Store
              </Button>
            </View>
          </View>
        </ScrollView>

        <Divider />
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleSubmitRating}
            style={styles.button}
            disabled={rating === 0}
          >
            {t('system.submit')}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

// Shared styles
const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  closeButton: {
    margin: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
    maxHeight: '70%',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    width: '100%',
  },
  appInfoContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  appIcon: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    margin: 0,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  sectionDivider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  ratingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  rating: {
    paddingVertical: 10,
  },
  storeRatingContainer: {
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  storeRatingText: {
    fontSize: 14,
    marginBottom: 12,
  },
  storeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  storeButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
