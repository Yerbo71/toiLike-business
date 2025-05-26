import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider, Text, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { LinearGradient } from 'expo-linear-gradient';

const SubscriptionsPage: React.FC = () => {
  const { t } = useI18n();
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#6200ee', '#ff6b6b']} style={styles.header}>
        <Title style={styles.title}>{t('subscriptions.title')}</Title>
      </LinearGradient>

      <Card style={styles.highlightCard}>
        <Card.Content>
          <Paragraph style={styles.highlightText}>
            {t('subscriptions.highlight')}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Free plan */}
      <Card style={styles.planCard}>
        <Card.Content>
          <Title style={styles.planName}>{t('subscriptions.plans.free.name')}</Title>
          <Paragraph style={styles.planPrice}>{t('subscriptions.plans.free.price')}</Paragraph>

          <List.Section>
            <List.Item
              title={t('subscriptions.plans.free.features.limited_access')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title={t('subscriptions.plans.free.features.few_orders')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title={t('subscriptions.plans.free.features.low_priority')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
          </List.Section>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="outlined"
            style={styles.currentButton}
            labelStyle={{ color: theme.colors.primary }}
          >
            {t('subscriptions.current_plan')}
          </Button>
        </Card.Actions>
      </Card>

      {/* Standard plan */}
      <Card style={[styles.planCard, styles.popularCard]}>
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>{t('subscriptions.popular')}</Text>
        </View>
        <Card.Content>
          <Title style={styles.planName}>{t('subscriptions.plans.standard.name')}</Title>
          <Paragraph style={styles.planPrice}>{t('subscriptions.plans.standard.price')}</Paragraph>
          <Paragraph style={styles.priceNote}>{t('subscriptions.plans.standard.price_note')}</Paragraph>

          <List.Section>
            <List.Item
              title={t('subscriptions.plans.standard.features.more_orders')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title={t('subscriptions.plans.standard.features.medium_priority')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title={t('subscriptions.plans.standard.features.analytics')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
          </List.Section>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            style={styles.selectButton}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            {t('subscriptions.select_plan')}
          </Button>
        </Card.Actions>
      </Card>

      {/* Premium plan */}
      <Card style={styles.planCard}>
        <Card.Content>
          <Title style={styles.planName}>{t('subscriptions.plans.premium.name')}</Title>
          <Paragraph style={styles.planPrice}>{t('subscriptions.plans.premium.price')}</Paragraph>
          <Paragraph style={styles.priceNote}>{t('subscriptions.plans.premium.price_note')}</Paragraph>

          <List.Section>
            <List.Item
              title={t('subscriptions.plans.premium.features.high_priority')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title={t('subscriptions.plans.premium.features.recommendations')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title={t('subscriptions.plans.premium.features.discounts')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
            <Divider />
            <List.Item
              title={t('subscriptions.plans.premium.features.advanced_analytics')}
              left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
            />
          </List.Section>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            style={styles.selectButton}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            {t('subscriptions.select_plan')}
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.helpContainer}>
        <Paragraph style={styles.helpText}>
          {t('subscriptions.need_help')} <Text style={styles.helpLink}>{t('subscriptions.contact_us')}</Text>
        </Paragraph>
      </View>
    </ScrollView>
  );
};

// @ts-ignore
const createStyles = (theme: ReactNativePaper.Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: "white",
  },
  highlightCard: {
    marginBottom: 20,
    backgroundColor: theme.colors.surfaceVariant,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.notification,
  },
  highlightText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.onSurfaceVariant,
  },
  planCard: {
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  popularCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: -30,
    backgroundColor: theme.colors.primary,
    padding: 5,
    width: 120,
    transform: [{ rotate: '45deg' }],
  },
  popularBadgeText: {
    color: theme.colors.onPrimary,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginVertical: 8,
  },
  priceNote: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  currentButton: {
    flex: 1,
    marginHorizontal: 8,
    borderColor: theme.colors.outline,
  },
  selectButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: theme.colors.primary,
  },
  helpContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  helpLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default SubscriptionsPage;