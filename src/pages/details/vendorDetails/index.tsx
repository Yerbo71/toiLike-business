import React, { useCallback } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Avatar, Button, Text, useTheme } from 'react-native-paper';
import DetailsDescriptionBlock from '@/src/pages/details/components/detailsDescriptionBlock';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { getRatingId, getUserVendorId } from '@/src/core/rest/userVendor';
import { useI18n } from '@/src/context/LocaleContext';
import {
  DetailRateBlock,
  EmptyView,
  ErrorView,
  LoadingView,
} from '@/src/shared';
import DetailsCommentBlock from '@/src/pages/details/components/detailsCommentBlock';
import VendorBasicBlock from '@/src/pages/details/vendorDetails/components/vendorBasicBlock';
import { useEvent } from '@/src/context/EventContext';

const { width } = Dimensions.get('window');

const VendorDetailsPage = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useI18n();
  const { event, setEvent } = useEvent();
  const queryClient = useQueryClient();
  const {
    data: vendor,
    isLoading: vendorIsLoading,
    error: vendorError,
    isRefetching,
  } = useQuery({
    queryKey: ['vendorDetails', id],
    queryFn: () => getUserVendorId(Number(id)),
    staleTime: 5 * 60 * 1000,
  });
  const {
    data: rating,
    isLoading: ratingIsLoading,
    error: ratingError,
  } = useQuery({
    queryKey: ['ratingDetails', id],
    queryFn: () => getRatingId(Number(id)),
    staleTime: 5 * 60 * 1000,
  });

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['vendorDetails', 'ratingDetails'],
    });
  }, [id, queryClient]);

  if (vendorIsLoading || ratingIsLoading || isRefetching) {
    return <LoadingView />;
  }

  if (vendorError || ratingError) {
    return <ErrorView />;
  }

  if (!vendor || !rating) {
    return <EmptyView />;
  }

  const handleSelectVendor = (vendorId: number) => {
    setEvent({
      ...event,
      eventServices: [{ id: vendorId as number }],
    });
    // @ts-ignore
    router.push('/(ordering)/vendorsChoose');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          progressBackgroundColor={theme.colors.surface}
          tintColor={theme.colors.primary}
        />
      }
    >
      <Image
        source={{ uri: vendor?.secondaryImage || 'https://picsum.photos/701' }}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <View
        style={[
          styles.contentContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.avatarContainer}>
          <View
            style={[styles.avatarBorder, { borderColor: theme.colors.primary }]}
          >
            <Avatar.Image
              source={{ uri: vendor?.mainImage || 'https://picsum.photos/100' }}
              size={100}
              style={styles.avatarImage}
            />
          </View>
        </View>

        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {vendor?.title || 'No title'}
        </Text>

        <DetailRateBlock
          rating={vendor.rating || 0}
          commentCount={rating?.totalCount || 0}
        />

        <Button
          mode="contained"
          icon="plus"
          style={[
            styles.messageButton,
            { backgroundColor: theme.colors.primary },
          ]}
          labelStyle={styles.buttonLabel}
          onPress={() => handleSelectVendor(vendor.id)}
        >
          {t('system.add')}
        </Button>

        <DetailsDescriptionBlock description={vendor?.description} />

        <VendorBasicBlock
          experience={vendor.experience?.toString()}
          averageCost={vendor.averageCost}
          serviceType={vendor.serviceType}
        />

        <DetailsCommentBlock
          commentCount={rating.totalCount || 0}
          ratings={rating.list || []}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 30,
    minHeight: width * 0.7,
  },
  avatarContainer: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  avatarBorder: {
    borderRadius: 60,
    padding: 4,
    backgroundColor: 'white',
    borderWidth: 3,
  },
  avatarImage: {
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 2,
    marginRight: 3,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  messageButton: {
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
  },
  socialContainer: {
    marginTop: 6,
    marginBottom: 12,
  },
  servicesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  servicesScrollContainer: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  serviceBlock: {
    width: width * 0.7,
    marginRight: 12,
  },
});

export default VendorDetailsPage;
