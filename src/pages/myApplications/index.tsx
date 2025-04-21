import React, { useCallback, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text, useTheme, Card, Button, Avatar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getAllEvents } from '@/src/core/rest/event/get-all-events';
import { AuthContext } from '@/src/context/AuthContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

const MyApplicationsPage = () => {
  const theme = useTheme();
  const { token } = useContext(AuthContext);
  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['eventAllEvents'],
    queryFn: () => (token ? getAllEvents(token) : Promise.resolve(null)),
    staleTime: 5 * 60 * 1000,
  });

  const [manualRefreshing, setManualRefreshing] = React.useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const onRefresh = useCallback(async () => {
    setManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setManualRefreshing(false);
    }
  }, [refetch]);

  console.log(eventsData);

  if (isLoading && !manualRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={48}
          color={theme.colors.error}
        />
        <Text style={{ color: theme.colors.error, marginVertical: 16 }}>
          Error loading events
        </Text>
        <Button mode="contained" onPress={onRefresh} loading={isRefetching}>
          Retry
        </Button>
      </View>
    );
  }

  if (!eventsData?.list?.length) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <MaterialCommunityIcons
          name="calendar-blank"
          size={48}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="titleMedium" style={{ marginTop: 16 }}>
          No events found
        </Text>
        <Button
          mode="outlined"
          style={{ marginTop: 16 }}
          onPress={onRefresh}
          loading={isRefetching}
        >
          Refresh
        </Button>
      </ScrollView>
    );
  }
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      <Text
        variant="titleLarge"
        style={[styles.header, { color: theme.colors.onSurface }]}
      >
        My Events ({eventsData.totalCount})
      </Text>

      {eventsData.list.map((event) => (
        <Card
          key={event.id}
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
        >
          <Card.Title
            title={event.title}
            subtitle={`${event.startedAt ? formatDate(event.startedAt) : 'N/A'} - ${event.endedAt ? formatDate(event.endedAt) : 'N/A'}`}
            titleStyle={{ fontWeight: 'bold' }}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="calendar"
                style={{ backgroundColor: theme.colors.primaryContainer }}
              />
            )}
          />

          <Card.Content>
            {event.description && (
              <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
                {event.description}
              </Text>
            )}

            {event.hall && (
              <View
                style={[
                  {
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: theme.colors.primary,
                  },
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="office-building"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text
                    variant="titleSmall"
                    style={[
                      styles.sectionTitle,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Venue Details
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Venue:
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {event.hall.title}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Location:
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {event.hall.placeInfoDto?.street},{'Test '}
                    {event.hall.placeInfoDto?.city}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Cost:
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {event.hall.cost?.toLocaleString()}T
                  </Text>
                </View>
              </View>
            )}

            {event.eventServices?.length > 0 && (
              <View
                style={[
                  {
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: theme.colors.primary,
                  },
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="tools"
                    size={20}
                    color={theme.colors.tertiary}
                  />
                  <Text
                    variant="titleSmall"
                    style={[
                      styles.sectionTitle,
                      { color: theme.colors.tertiary },
                    ]}
                  >
                    Included Services ({event.eventServices.length})
                  </Text>
                </View>

                {event.eventServices.map((service) => (
                  <View key={service.id} style={styles.serviceContainer}>
                    <View style={styles.serviceHeader}>
                      <MaterialCommunityIcons
                        name={getServiceIcon(service.serviceType)}
                        size={18}
                        color={theme.colors.onSurface}
                      />
                      <Text variant="bodyLarge" style={styles.serviceTitle}>
                        {service.title}
                      </Text>
                    </View>

                    <View style={styles.serviceDetails}>
                      <View style={styles.serviceDetailItem}>
                        <Text variant="labelSmall" style={styles.detailLabel}>
                          Type:
                        </Text>
                        <Text variant="bodySmall" style={styles.detailValue}>
                          {service.serviceType}
                        </Text>
                      </View>

                      <View style={styles.serviceDetailItem}>
                        <Text variant="labelSmall" style={styles.detailLabel}>
                          Cost:
                        </Text>
                        <Text variant="bodySmall" style={styles.detailValue}>
                          {service.averageCost?.toLocaleString()}T
                        </Text>
                      </View>

                      <View style={styles.serviceDetailItem}>
                        <Text variant="labelSmall" style={styles.detailLabel}>
                          Experience:
                        </Text>
                        <Text variant="bodySmall" style={styles.detailValue}>
                          {service.experience}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>

          <Card.Actions style={styles.cardActions}>
            <Button
              mode="outlined"
              style={styles.actionButton}
              labelStyle={{ color: theme.colors.primary }}
            >
              View Details
            </Button>
            <Button
              mode="contained"
              style={styles.actionButton}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              Manage Event
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const getServiceIcon = (serviceType: string) => {
  switch (serviceType) {
    case 'PRESENTERS':
      return 'microphone';
    case 'CATERING':
      return 'food';
    case 'EQUIPMENT':
      return 'television';
    case 'SECURITY':
      return 'shield';
    default:
      return 'toolbox';
  }
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  section: {
    marginTop: 12,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  serviceItem: {
    marginBottom: 8,
    paddingLeft: 28,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  detailLabel: {
    fontWeight: '600',
    width: 80,
    color: '#616161',
  },

  detailValue: {
    flex: 1,
    fontWeight: '500',
  },

  serviceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },

  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  serviceTitle: {
    fontWeight: '600',
    marginLeft: 8,
  },

  serviceDetails: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  serviceDescription: {
    color: '#616161',
    fontStyle: 'italic',
  },

  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  actionButton: {
    borderRadius: 6,
    minWidth: 150,
  },
});

export default MyApplicationsPage;
