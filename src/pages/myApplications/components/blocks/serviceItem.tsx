import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { components } from '@/src/types/api2';

interface ServiceItemProps {
  service: components['schemas']['EventVendorResponse'];
}

export const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  const theme = useTheme();

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

  const getStatusColor = () => {
    switch (service.status) {
      case 'CONFIRMED':
        return '#4CAF50';
      case 'PENDING':
        return '#FFC107';
      case 'REJECTED':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getStatusIcon = () => {
    switch (service.status) {
      case 'CONFIRMED':
        return 'check-circle';
      case 'PENDING':
        return 'clock';
      case 'REJECTED':
        return 'close-circle';
      default:
        return 'information';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.dark
            ? theme.colors.elevation.level1
            : theme.colors.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name={getServiceIcon(service.serviceType)}
            size={20}
            color={theme.colors.primary}
          />
          <Text variant="titleMedium" style={[styles.title, { marginLeft: 8 }]}>
            {service.title}
          </Text>
        </View>

        {service.status && (
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <MaterialCommunityIcons
              name={getStatusIcon()}
              size={16}
              color={theme.colors.onPrimary}
            />
            <Text
              variant="labelSmall"
              style={[styles.statusText, { color: theme.colors.onPrimary }]}
            >
              {service.status}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        {service.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {service.description}
          </Text>
        )}

        <View style={styles.detailsRow}>
          {/* Стоимость */}
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="cash"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={styles.detailText}>
              {service.averageCost
                ? `${service.averageCost.toLocaleString()} T`
                : 'Not specified'}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="chart-line"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={styles.detailText}>
              {service.experience
                ? `${service.experience} years`
                : 'Experience not specified'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          {service.rating && (
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="star"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={styles.detailText}>
                {service.rating.toFixed(1)}/5.0
              </Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name="tag"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={styles.detailText}>
              {service.serviceType}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontWeight: '600',
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  statusText: {
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    gap: 8,
  },
  description: {
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    marginLeft: 8,
    color: '#616161',
  },
});
