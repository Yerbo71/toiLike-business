import React, { useContext, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider, Text, useTheme } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { LinearGradient } from 'expo-linear-gradient';
import type { operations } from '@/src/types/api2';
import { AuthContext } from '@/src/context/AuthContext';
import { getCurrentUser, postSubscription } from '@/src/core/rest/user';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

interface Props {
  subscriptionData: operations['getAllSubscriptions']['responses'][200]['content']['*/*'];
}

const SubscriptionsPage: React.FC<Props> = ({ subscriptionData }) => {
  const { t } = useI18n();
  const theme = useTheme();
  const { user,token,updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<number | null>(null);
  const checkedSubscription = user?.subscription[0].subscription || 'FREE';

  const sortedSubscriptions = [...subscriptionData].sort((a, b) => {
    if (a.name === 'FREE') return -1;
    if (b.name === 'FREE') return 1;
    if (a.name.includes('STANDARD')) return -1;
    if (b.name.includes('STANDARD')) return 1;
    return 0;
  });

  const handleSubscription = async (subscriptionId: number) => {
    try {
      setLoading(subscriptionId);
      const response = await postSubscription(subscriptionId);
      Toast.show({
        type: 'success',
        text1: t('subscriptions.successTitle'),
        text2: t('subscriptions.successMessage'),
      });
      if (token) {
        const updatedUser = await getCurrentUser(token);
        updateUser(updatedUser);
      }
      router.push('/(protected)/(application)/profile');
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || t('subscriptions.errorMessage');

      Toast.show({
        type: 'error',
        text1: t('subscriptions.errorTitle'),
        text2: errorMessage,
      });

      console.log('subscription error', err);
    }finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView style={{...styles.container, backgroundColor: theme.colors.background}}>
      <LinearGradient colors={['#6200ee', '#ff6b6b']} style={styles.header}>
        <Title style={styles.title}>{t('subscriptions.title')}</Title>
      </LinearGradient>

      <Card style={{
        ...styles.highlightCard,
        backgroundColor: theme.colors.surfaceVariant,
        borderLeftColor: theme.colors.primary,
        borderLeftWidth: 4
      }}>
        <Card.Content>
          <Paragraph style={{
            ...styles.highlightText,
            color: theme.colors.onSurfaceVariant
          }}>
            {t('subscriptions.highlight')}
          </Paragraph>
        </Card.Content>
      </Card>

      {sortedSubscriptions.map((subscription) => {
        const isCurrentPlan = checkedSubscription === subscription.name;
        const isPopular = subscription.name.includes('STANDARD');
        const descriptionLines = subscription?.description?.split('\n').filter(line => line.trim() !== '');

        return (
          <Card
            key={subscription.id}
            style={[
              styles.planCard,
              { backgroundColor: theme.colors.surface },
              isPopular && {
                ...styles.popularCard,
                borderColor: theme.colors.primary,
                borderWidth: 2
              },
              isCurrentPlan && {
                ...styles.currentPlanCard,
                borderColor: theme.colors.outline,
                borderWidth: 1
              }
            ]}
          >
            {isPopular && (
              <View style={{
                ...styles.popularBadge,
                backgroundColor: theme.colors.primary
              }}>
                <Text style={{
                  ...styles.popularBadgeText,
                  color: theme.colors.onPrimary
                }}>
                  {t('subscriptions.popular')}
                </Text>
              </View>
            )}

            <Card.Content>
              <Title style={{
                ...styles.planName,
                color: theme.colors.inverseSurface
              }}>
                {subscription.name.replace('_PRO', '').replace('_', ' ')}
              </Title>

              <Paragraph style={{
                ...styles.planPrice,
                color: theme.colors.primary
              }}>
                {t("subscriptions.for_individuals")} {subscription.price} KZT
              </Paragraph>

              {subscription.priceUl > 0 && (
                <Paragraph style={{
                  ...styles.priceNote,
                  color: theme.colors.secondary
                }}>
                  {t("subscriptions.for_legal_entities")} {subscription.priceUl} KZT
                </Paragraph>
              )}

              <List.Section>
                {descriptionLines?.map((line, index) => (
                  <React.Fragment key={index}>
                    <List.Item
                      title={line}
                      left={() => <List.Icon icon="chevron-right" color={theme.colors.primary} />}
                    />
                    {index < descriptionLines.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List.Section>
            </Card.Content>

            <Card.Actions>
              {isCurrentPlan ? (
                <Button
                  mode="outlined"
                  style={{
                    ...styles.currentButton,
                    borderColor: theme.colors.outline
                  }}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  {t('subscriptions.current_plan')}
                </Button>
              ) : (
                <Button
                  mode="contained"
                  style={{
                    ...styles.selectButton,
                    backgroundColor: theme.colors.primary
                  }}
                  labelStyle={{ color: theme.colors.onPrimary }}
                  onPress={() => handleSubscription(subscription.id)}
                  disabled={loading === subscription.id}
                >
                  {loading === subscription.id ? (
                    <ActivityIndicator animating={true} color={theme.colors.onPrimary} />
                  ) : (
                    t('subscriptions.select_plan')
                  )}
                </Button>
              )}
            </Card.Actions>
          </Card>
        );
      })}

      <View style={styles.helpContainer}>
        <Paragraph style={{
          ...styles.helpText,
          color: theme.colors.inverseSurface
        }}>
          {t('subscriptions.need_help')} <Text style={{
          ...styles.helpLink,
          color: theme.colors.primary
        }}>{t('subscriptions.contact_us')}</Text>
        </Paragraph>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  },
  highlightText: {
    fontSize: 16,
    lineHeight: 24,
  },
  planCard: {
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    padding: 4,
  },
  popularCard: {},
  currentPlanCard: {},
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: -30,
    padding: 5,
    width: 120,
    transform: [{ rotate: '45deg' }],
  },
  popularBadgeText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  priceNote: {
    fontSize: 14,
    marginBottom: 12,
  },
  currentButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  selectButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  helpContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 16,
  },
  helpLink: {
    fontWeight: 'bold',
  },
});

export default SubscriptionsPage;