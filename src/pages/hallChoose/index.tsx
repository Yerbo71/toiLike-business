import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
  useTheme,
  Chip,
} from 'react-native-paper';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '@/src/context/AuthContext';
import { useEvent } from '@/src/context/EventContext';
import { getPlaces } from '@/src/core/rest/place/get-places';

const HallChoosePage = () => {
  const { token } = useContext(AuthContext);
  const { event, setEvent } = useEvent();
  const theme = useTheme();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getPlaces(token!);
        setPlaces(data);
        setSelectedId(event.hallId);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load places',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [token, event.hallId]);

  const handleSelectPlace = (place: any) => {
    setSelectedId(place.id);
    setEvent({
      ...event,
      hallId: place.id,
      place: {
        id: place.id,
        title: place.title,
        city: place.city,
        street: place.street,
        description: place.description,
      },
    });
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Choose Your Venue
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Select the perfect location for your event
          </Text>
        </View>

        {places.map((place) => (
          <TouchableOpacity
            key={place.id}
            onPress={() => handleSelectPlace(place)}
            activeOpacity={0.9}
          >
            <Card
              style={[
                styles.card,
                selectedId === place.id && {
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              {place.image && (
                <Card.Cover
                  source={{ uri: place.image }}
                  style={styles.cardImage}
                />
              )}
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text variant="titleLarge" style={styles.placeTitle}>
                    {place.title}
                  </Text>
                  {selectedId === place.id && (
                    <Icon
                      name="check-circle"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </View>

                <View style={styles.locationRow}>
                  <Icon name="map-marker" size={16} color="#666" />
                  <Text variant="bodyMedium" style={styles.locationText}>
                    {[place.city, place.street].filter(Boolean).join(', ')}
                  </Text>
                </View>

                {place.description && (
                  <Text variant="bodySmall" style={styles.description}>
                    {place.description}
                  </Text>
                )}

                <View style={styles.tagsContainer}>
                  {place.capacity && (
                    <Chip icon="account-group" style={styles.tag}>
                      {place.capacity} people
                    </Chip>
                  )}
                  {place.type && (
                    <Chip icon="home-city" style={styles.tag}>
                      {place.type}
                    </Chip>
                  )}
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    color: '#666',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  cardImage: {
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    color: '#666',
  },
  description: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
  },
});

export default HallChoosePage;
