import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { components } from '@/src/types/api2';
import { useI18n } from '@/src/context/LocaleContext';

interface VenueDetailsProps {
  place: components['schemas']['PlaceResponse'];
}

export const VenueDetails: React.FC<VenueDetailsProps> = ({ place }) => {
  const theme = useTheme();
  const { t } = useI18n();
  if (!place) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderLeftColor: theme.colors.primary,
        },
      ]}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="office-building"
          size={20}
          color={theme.colors.primary}
        />
        <Text
          variant="titleSmall"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          {t('system.venue')}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons
          name="home-city"
          size={16}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="bodyMedium" style={styles.detailText}>
          {place.title}
        </Text>
      </View>

      {(place.city || place.street) && (
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="bodyMedium" style={styles.detailText}>
            {[place.street, place.city].filter(Boolean).join(', ')}
          </Text>
        </View>
      )}

      {place.description && (
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name="text"
            size={16}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant="bodyMedium" style={styles.detailText}>
            {place.description}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        {place.rating && (
          <View style={styles.footerItem}>
            <MaterialCommunityIcons
              name="star"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={styles.footerText}>
              {place.rating.toFixed(1)}/5.0
            </Text>
          </View>
        )}

        {place.cost && (
          <View style={styles.footerItem}>
            <MaterialCommunityIcons
              name="cash"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={styles.footerText}>
              {place.cost.toLocaleString()} T
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    marginLeft: 8,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 4,
    color: '#616161',
  },
});
