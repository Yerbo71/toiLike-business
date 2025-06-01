import { Card, Text, useTheme, Button } from 'react-native-paper';
import { View, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { components } from '@/src/types/api2';
import { useI18n } from '@/src/context/LocaleContext';
import {
  postConfirm,
  postReject,
} from '@/src/core/rest/user-vendor-controller';
import { useQueryClient } from '@tanstack/react-query';
import { formatDate, SupportedLocale } from '@/src/core/utils';

type UserVendorResponse = components['schemas']['FullEventVendorResponse'];

export const ApplicationCard = ({
  service,
  actions,
}: {
  service: UserVendorResponse;
  actions?: boolean;
}) => {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const queryClient = useQueryClient();

  const handleReject = async () => {
    try {
      await postReject(service.id);
      queryClient.refetchQueries({ queryKey: ['vendorApplications'] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async () => {
    try {
      await postConfirm(service.id);
      queryClient.refetchQueries({ queryKey: ['vendorApplications'] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]}
    >
      <Card.Content>
        <Text
          variant="titleLarge"
          style={{
            color: theme.colors.primary,
            marginBottom: 8,
            fontWeight: 'bold',
          }}
        >
          {service.event.title}
        </Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={theme.colors.onSurface}
          />
          <Text variant="bodyMedium" style={styles.infoText}>
            {formatDate(
              service?.event?.startedAt ?? '',
              locale as SupportedLocale,
            )}{' '}
            -{' '}
            {formatDate(
              service?.event?.endedAt ?? '',
              locale as SupportedLocale,
            )}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color={theme.colors.onSurface}
          />
          <Text variant="bodyMedium" style={styles.infoText}>
            {service.event.place?.cityEnum}, {service.event.place?.street}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="cash"
            size={20}
            color={theme.colors.onSurface}
          />
          <Text variant="bodyMedium" style={styles.infoText}>
            {t('system.price')}: {service.event.totalCost.toLocaleString()} KZT
          </Text>
        </View>
      </Card.Content>

      <View
        style={[styles.divider, { backgroundColor: theme.colors.outline }]}
      />

      <Card.Content style={styles.vendorSection}>
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.primary,
            marginBottom: 8,
            fontWeight: 'bold',
          }}
        >
          {service.userVendor.title}
        </Text>
        {service.userVendor.mainImage && (
          <Image
            source={{
              uri: `${service.userVendor.mainImage}?t=${Date.now()}`,
            }}
            style={{
              ...styles.vendorImage,
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
            resizeMode="cover"
          />
        )}

        <View style={styles.cardHeader}>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
            {t('system.serviceCost')}
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
            {service.cost.toLocaleString()} KZT
          </Text>
        </View>

        {service.userVendor.description && (
          <Text variant="bodyMedium" style={styles.cardDescription}>
            {service.userVendor.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.footerLeft}>
            {service.userVendor.serviceType && (
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.primary }}
              >
                {service.userVendor.serviceType}
              </Text>
            )}
            {service.userVendor.experience && (
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.primary }}
              >
                {t('system.experience')} {service.userVendor.experience}{' '}
                {t('system.years')}
              </Text>
            )}
          </View>

          {service.userVendor.rating && (
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons
                name="star"
                size={20}
                color={theme.colors.primary}
              />
              <Text variant="labelMedium" style={{ marginLeft: 4 }}>
                {service.userVendor.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
      {actions && (
        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            style={styles.button}
            icon="close"
            onPress={handleReject}
          >
            {t('system.reject')}
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            icon="check"
            onPress={handleConfirm}
          >
            {t('system.confirm')}
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
    paddingBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDescription: {
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: 6,
    minWidth: 140,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  vendorSection: {
    paddingTop: 16,
  },
  vendorImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 16,
  },
});
