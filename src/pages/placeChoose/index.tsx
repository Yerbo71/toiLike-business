import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
  useTheme,
  Button,
  Menu,
  Searchbar,
} from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '@/src/context/AuthContext';
import { useEvent } from '@/src/context/EventContext';
import { getPlaceSearch } from '@/src/core/rest/place';
import { useQuery } from '@tanstack/react-query';
import type { operations } from '@/src/types/api2';
import { useGlobalFilters } from '@/src/context/GlobalFilterContext';
import { useI18n } from '@/src/context/LocaleContext';
import { ErrorView, LoadingView } from '@/src/shared';

type GetPlaceSearchParams = NonNullable<
  operations['searchUserVendors_1']['parameters']['query']
>;

const PlaceChoosePage = () => {
  const { token } = useContext(AuthContext);
  const { city, setCity } = useGlobalFilters();
  const { event, setEvent } = useEvent();
  const theme = useTheme();
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useState<GetPlaceSearchParams>({
    page: 0,
    size: 10,
  });
  const [searchText, setSearchText] = useState('');
  const [sizeMenuVisible, setSizeMenuVisible] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    if (city) {
      setSearchParams((prev) => ({
        ...prev,
        city: city,
        page: 0,
      }));
    }
  }, [city]);

  const debouncedSearch = useCallback(
    (text: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        setSearchParams((prev) => ({
          ...prev,
          q: text,
          page: 0,
        }));
      }, 500);

      setSearchTimeout(timeout);
    },
    [searchTimeout],
  );

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const {
    data: placesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['placeSearch', searchParams],
    queryFn: () => getPlaceSearch(searchParams),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const places = placesResponse?.list || [];
  const totalPages = placesResponse?.totalPages || 0;
  const currentPage = searchParams.page || 0;

  const handleSelectPlace = (placeId: number) => {
    setSelectedId(placeId);
    setEvent({
      ...event,
      placeId: placeId,
    });
    router.back();
  };

  const handleViewDetails = (placeId: number) => {
    router.push({
      pathname: '/(application)/placeDetails/[id]',
      params: { id: placeId.toString() },
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setSearchParams((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  const handleSizeChange = (newSize: number) => {
    setSizeMenuVisible(false);
    setSearchParams((prev) => ({
      ...prev,
      size: newSize,
      page: 0,
    }));
  };

  const clearCityFilter = () => {
    setCity(null);
    setSearchParams((prev) => ({
      ...prev,
      city: undefined,
      page: 0,
    }));
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder={t('system.search')}
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <Button
            mode="outlined"
            onPress={() => router.push('/(ordering)/cityChoose')}
            style={styles.filterButton}
            icon="map-marker"
          >
            {city || t('system.selectCity')}
          </Button>

          <Menu
            visible={sizeMenuVisible}
            onDismiss={() => setSizeMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setSizeMenuVisible(true)}
                style={styles.filterButton}
                icon="format-list-numbered"
              >
                {t('system.size')}: {searchParams.size}
              </Button>
            }
          >
            <Menu.Item onPress={() => handleSizeChange(10)} title="10" />
            <Menu.Item onPress={() => handleSizeChange(20)} title="20" />
            <Menu.Item onPress={() => handleSizeChange(30)} title="30" />
          </Menu>

          {city && (
            <Button
              mode="outlined"
              onPress={clearCityFilter}
              style={styles.filterButton}
              icon="close"
            >
              {t('system.clear')}
            </Button>
          )}
        </View>

        {isLoading && !places.length && <LoadingView />}
        {error && <ErrorView />}

        {/* Places List */}
        {places.map((place) => (
          <Card key={place.id} style={styles.card}>
            {place.mainImage && (
              <Card.Cover
                source={{ uri: place.mainImage }}
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

              <View style={styles.buttonsContainer}>
                <Button
                  mode="outlined"
                  onPress={() => handleViewDetails(place.id)}
                  style={styles.actionButton}
                >
                  {t('system.view')}
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleSelectPlace(place.id)}
                  style={styles.actionButton}
                >
                  {t('system.select')}
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Pagination Controls */}
        <View style={styles.paginationContainer}>
          <Button
            mode="outlined"
            disabled={currentPage === 0}
            onPress={() => handlePageChange(currentPage - 1)}
          >
            {t('system.previous')}
          </Button>
          <Text style={styles.pageText}>
            {t('system.page')} {currentPage + 1} {t('system.of')} {totalPages}
          </Text>
          <Button
            mode="outlined"
            disabled={currentPage >= totalPages - 1}
            onPress={() => handlePageChange(currentPage + 1)}
          >
            {t('system.next')}
          </Button>
        </View>

        {isLoading && currentPage > 0 && (
          <ActivityIndicator
            animating={true}
            size="small"
            color={theme.colors.primary}
            style={styles.loadingMore}
          />
        )}
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
  searchContainer: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  cardImage: {
    height: 160,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  pageText: {
    color: '#666',
  },
  loadingMore: {
    marginVertical: 16,
  },
});

export default PlaceChoosePage;
