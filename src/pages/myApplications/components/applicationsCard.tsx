import React from 'react';
import { Card, Button, Avatar, useTheme, Text } from 'react-native-paper';
import { format } from 'date-fns';
import { StyleSheet, View } from 'react-native';
import type { components } from '@/src/types/api2';
import { ServiceList } from '@/src/pages/myApplications/components/blocks/serviceList';
import { VenueDetails } from '@/src/pages/myApplications/components/blocks/venueDetails';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useI18n } from '@/src/context/LocaleContext';
import { router } from 'expo-router';

interface EventCardProps {
  application: components['schemas']['EventResponse'];
}

const formatDate = (dateString?: string) => {
  return dateString ? format(new Date(dateString), 'dd MMM yyyy') : 'N/A';
};

export const ApplicationsCard: React.FC<EventCardProps> = ({ application }) => {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <Card
      style={[
        styles.container,
        {
          backgroundColor: theme.dark
            ? theme.colors.elevation.level1
            : theme.colors.surface,
        },
      ]}
    >
      <Card.Title
        title={application.title}
        subtitle={`${formatDate(application.startedAt)} - ${formatDate(application.endedAt)}`}
        titleStyle={styles.title}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="calendar"
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
        )}
        right={(props) => (
          <View style={styles.totalCostContainer}>
            <MaterialCommunityIcons
              name="cash"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.totalCost, { color: theme.colors.primary }]}>
              {application.totalCost.toLocaleString()} T
            </Text>
          </View>
        )}
      />

      <Card.Content>
        {application.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {application.description}
          </Text>
        )}

        {application.place && <VenueDetails place={application.place} />}

        {application.eventServices?.length > 0 && (
          <ServiceList services={application.eventServices} />
        )}
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button
          mode="outlined"
          style={styles.button}
          labelStyle={{ color: theme.colors.primary }}
          icon="circle-edit-outline"
          onPress={() => {
            router.push({
              pathname: '/(ordering)/manualOrdering/[id]',
              params: { id: application.id },
            });
          }}
        >
          {t('system.manage')}
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={{ color: theme.colors.onPrimary }}
          icon="robot"
          onPress={() => {
            router.push({
              pathname: '/(chats)/chat/gemini/[eventId]',
              params: { eventId: application.id },
            });
          }}
        >
          {t('system.aiAnalysis')}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  totalCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  totalCost: {
    marginLeft: 4,
    fontWeight: '600',
  },
  description: {
    marginBottom: 16,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    borderRadius: 6,
    minWidth: 140,
  },
});
