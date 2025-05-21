import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
  useTheme,
  Button,
  Searchbar,
  Chip,
} from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '@/src/context/AuthContext';
import { useEvent } from '@/src/context/EventContext';
import { getUserVendorsSearch } from '@/src/core/rest/userVendor';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@/src/context/LocaleContext';
import { ErrorView, LoadingView } from '@/src/shared';
import { VendorServiceType } from '@/src/constants/mock/values';
import { VendorsFilterModal } from '@/src/pages/vendorsChoose/components/vendorsFilterModal';

type SearchParams = {
  page: number;
  size: number;
  q: string;
  serviceType?: VendorServiceType;
  minCost?: number;
  maxCost?: number;
  minExperience?: number;
  maxExperience?: number;
};

const VendorsChoosePage = () => {
  const { token } = useContext(AuthContext);
  const { event, setEvent } = useEvent();
  const theme = useTheme();
  const { t } = useI18n();
  const [selectedIds, setSelectedIds] = useState<number[]>(
    event.eventServices.map((service) => service.id),
  );
  const [filterModal, setFilterModal] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 0,
    size: 10,
    q: '',
    serviceType: undefined,
    minCost: undefined,
    maxCost: undefined,
    minExperience: undefined,
    maxExperience: undefined,
  });
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [sliderValues, setSliderValues] = useState({
    cost: [0, 1000000],
    experience: [0, 30],
  });

  const debouncedSearch = useCallback(
    (text: string) => {
      if (searchTimeout) clearTimeout(searchTimeout);
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
    data: vendorsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['vendorSearch', searchParams],
    queryFn: () => getUserVendorsSearch(searchParams),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const vendors = vendorsResponse?.list || [];
  const totalPages = vendorsResponse?.totalPages || 0;
  const currentPage = searchParams.page || 0;

  const handleSelectVendor = (vendorId: number) => {
    let newSelectedIds: number[];
    let newEventServices: { id: number }[];

    if (selectedIds.includes(vendorId)) {
      // Deselect vendor
      newSelectedIds = selectedIds.filter((id) => id !== vendorId);
      newEventServices = event.eventServices.filter(
        (service) => service.id !== vendorId,
      );
    } else {
      // Select vendor
      newSelectedIds = [...selectedIds, vendorId];
      newEventServices = [...event.eventServices, { id: vendorId }];
    }

    setSelectedIds(newSelectedIds);
    setEvent({ ...event, eventServices: newEventServices });
  };

  const handleViewDetails = (vendorId: number) => {
    router.push({
      pathname: '/(application)/vendorDetails/[id]',
      params: { id: vendorId.toString() },
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setSearchParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  const applyFilters = (
    newParams: Partial<SearchParams>,
    newSliderValues: { cost: number[]; experience: number[] },
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      ...newParams,
      page: 0,
    }));
    setSliderValues(newSliderValues);
    setFilterModal(false);
  };

  const clearAllFilters = () => {
    setSearchText('');
    setSearchParams({
      page: 0,
      size: 10,
      q: '',
      serviceType: undefined,
      minCost: undefined,
      maxCost: undefined,
      minExperience: undefined,
      maxExperience: undefined,
    });
    setSliderValues({
      cost: [0, 1000000],
      experience: [0, 30],
    });
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

        <View style={styles.filterContainer}>
          <Button
            mode="outlined"
            onPress={() => setFilterModal(true)}
            style={styles.filterButton}
            icon="format-list-bulleted-type"
          >
            {t('system.filters')}
          </Button>

          {(searchParams.q ||
            searchParams.serviceType ||
            searchParams.minCost ||
            searchParams.maxCost ||
            searchParams.minExperience ||
            searchParams.maxExperience) && (
            <Button
              mode="outlined"
              onPress={clearAllFilters}
              style={styles.filterButton}
              icon="close"
            >
              {t('vendorsPage.clearAll')}
            </Button>
          )}
        </View>

        {isLoading && !vendors.length && <LoadingView />}
        {error && <ErrorView />}

        {vendors.map((vendor) => (
          <Card key={vendor.id} style={styles.card}>
            {vendor.mainImage && (
              <Card.Cover
                source={{ uri: vendor.mainImage }}
                style={styles.cardImage}
              />
            )}
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge" style={styles.placeTitle}>
                  {vendor.title}
                </Text>
                {selectedIds.includes(vendor.id) && (
                  <Icon
                    name="check-circle"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </View>

              <View style={styles.tagsContainer}>
                {vendor.serviceType && (
                  <Chip
                    icon="account"
                    style={{
                      ...styles.tag,
                      backgroundColor: theme.colors.elevation.level4,
                    }}
                  >
                    {t('vendorsPage.serviceType')}: {vendor.serviceType}
                  </Chip>
                )}
                {vendor.experience && (
                  <Chip
                    icon="calendar"
                    style={{
                      ...styles.tag,
                      backgroundColor: theme.colors.elevation.level4,
                    }}
                  >
                    {t('vendorsPage.experience')}: {vendor.experience}{' '}
                    {t('system.year')}
                  </Chip>
                )}
                {vendor.averageCost && (
                  <Chip
                    icon="cash"
                    style={{
                      ...styles.tag,
                      backgroundColor: theme.colors.elevation.level4,
                    }}
                  >
                    {t('vendorsPage.serviceType')}:{' '}
                    {vendor.averageCost.toLocaleString()} ₸
                  </Chip>
                )}
                {vendor.rating && (
                  <Chip
                    icon="star"
                    style={{
                      ...styles.tag,
                      backgroundColor: theme.colors.elevation.level4,
                    }}
                  >
                    {t('vendorsPage.rating')}: {vendor.rating}/10
                  </Chip>
                )}
              </View>

              {vendor.description && (
                <Text variant="bodySmall" style={styles.description}>
                  {vendor.description}
                </Text>
              )}

              <View style={styles.buttonsContainer}>
                <Button
                  mode="outlined"
                  onPress={() => handleViewDetails(vendor.id)}
                  style={styles.actionButton}
                >
                  {t('system.details')}
                </Button>
                <Button
                  mode={
                    selectedIds.includes(vendor.id) ? 'outlined' : 'contained'
                  }
                  onPress={() => handleSelectVendor(vendor.id)}
                  style={styles.actionButton}
                >
                  {selectedIds.includes(vendor.id)
                    ? t('system.deselect')
                    : t('system.select')}
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        <View style={styles.paginationContainer}>
          <Button
            mode="outlined"
            disabled={currentPage === 0}
            onPress={() => handlePageChange(currentPage - 1)}
          >
            {t('system.previous')}
          </Button>
          <Text style={styles.pageText}>
            {t('system.page')} {currentPage + 1} {t('system.total')}{' '}
            {totalPages}
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
      <VendorsFilterModal
        visible={filterModal}
        onDismiss={() => setFilterModal(false)}
        searchParams={searchParams}
        sliderValues={sliderValues}
        applyFilters={applyFilters}
      />
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
    elevation: 2,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    borderRadius: 12,
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

export default VendorsChoosePage;
