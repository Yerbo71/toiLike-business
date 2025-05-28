import { Card, Text, useTheme,  Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { components } from '@/src/types/api2';
import { router } from 'expo-router';
import { useI18n } from '@/src/context/LocaleContext';
import { useQueryClient } from '@tanstack/react-query';
import { deletePlace } from '@/src/core/rest/place-controller';

type PlaceResponse = components["schemas"]["PlaceResponse"];

export const PlaceCard = ({ place }: { place: PlaceResponse }) => {
  const theme = useTheme();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deletePlace(place.id);
      queryClient.refetchQueries({queryKey: ['myPlaces']});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]}>
      {place.mainImage && (
        <Card.Cover
          source={{
            uri: `${place.mainImage}?t=${Date.now()}`
          }}
          style={styles.cardCover}
        />
      )}

      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
            {place.title}
          </Text>
          {place.cost && (
            <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
              {place.cost} KZT
            </Text>
          )}
        </View>

        {place.description && (
          <Text variant="bodyMedium" style={styles.cardDescription}>
            {place.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.footerLeft}>
            {place.cityEnum && (
              <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                {place.cityEnum} {", "} {place.street}
              </Text>
            )}
          </View>

          {place.rating && (
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons
                name="star"
                size={20}
                color={theme.colors.primary}
              />
              <Text variant="labelMedium" style={{ marginLeft: 4 }}>
                {place.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
      <Card.Actions >
        <Button
          mode="outlined"
          style={styles.button}
          labelStyle={{ color: theme.colors.primary }}
          icon="trash-can-outline"
          onPress={() => handleDelete()}
        >
          {t('system.delete')}
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          icon="circle-edit-outline"
          onPress={() => {
            router.push({
              pathname: '/(protected)/(flow)/placeCreate/[id]',
              params: { id: place.id },
            });
          }}
        >
          {t('system.manage')}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  cardCover: {
    height: 160,
    borderRadius: 0,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 12,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryImage: {
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: 6,
    minWidth: 140,
  },
});