import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useI18n } from '@/src/context/LocaleContext';

interface Service {
  id: number;
  title?: string;
  additionalVendors?: string;
  rating?: number;
  reviews?: number;
}

interface ServicesBlockProps {
  services: Service[];
}

const DetailProfileServiceBlock: React.FC<ServicesBlockProps> = ({
  services = [],
}) => {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.servicesContainer}>
      <Text
        variant="titleMedium"
        style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
      >
        {t('detailsPage.includedServices')}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.servicesScrollContainer}
      >
        {services.map((service, index) => (
          <Card
            key={`service-${index}`}
            style={[
              styles.serviceCard,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Card.Content>
              <View style={styles.serviceHeader}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.primary}
                  style={styles.serviceIcon}
                />
                <Text
                  variant="titleSmall"
                  style={[
                    styles.serviceTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {service.title}
                </Text>
              </View>

              {service.additionalVendors && (
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.serviceDescription,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {service.additionalVendors}
                </Text>
              )}

              <View style={styles.serviceRating}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text
                  style={[styles.ratingText, { color: theme.colors.onSurface }]}
                >
                  {service.rating !== undefined
                    ? service.rating.toFixed(1)
                    : 'N/A'}
                </Text>
                <Text
                  style={[
                    styles.reviewsText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  ({service.reviews} reviews)
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  servicesContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  servicesScrollContainer: {
    paddingBottom: 16,
  },
  serviceCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceIcon: {
    marginRight: 8,
  },
  serviceTitle: {
    fontWeight: '600',
    flexShrink: 1,
  },
  serviceDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 8,
    fontSize: 14,
  },
  reviewsText: {
    fontSize: 12,
  },
});

export default DetailProfileServiceBlock;
