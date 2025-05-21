import React, { useCallback } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import DetailsDescriptionBlock from '../components/detailsDescriptionBlock';
import DetailProfileSocialNetBlock from './components/detailProfileSocialNetBlock';
import {
  DetailRateBlock,
  EmptyView,
  ErrorView,
  LoadingView,
} from '@/src/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPopularEventByIDTemplates } from '@/src/core/rest/templates';
import { useLocalSearchParams } from 'expo-router';
import DetailsCommentBlock from '@/src/pages/details/components/detailsCommentBlock';
import DetailProfileServiceBlocks from '@/src/pages/details/detailProfile/components/detailProfileServiceBlocks';
import DetailProfileContactBlock from '@/src/pages/details/detailProfile/components/detailProfileContactBlock';

const { width } = Dimensions.get('window');

const DetailProfilePage = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const {
    data: event,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['eventDetails', id],
    queryFn: () => getPopularEventByIDTemplates(Number(id)),
    staleTime: 5 * 60 * 1000,
  });

  const onRefresh = useCallback(() => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['eventDetails', id] });
  }, [id, refetch, queryClient]);

  if (isLoading && !isRefetching) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView />;
  }

  if (!event) {
    return <EmptyView />;
  }

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
        source={{ uri: event.secondaryImage || 'https://picsum.photos/701' }}
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
              source={{ uri: event.mainImage || 'https://picsum.photos/100' }}
              size={100}
              style={styles.avatarImage}
            />
          </View>
        </View>

        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {event.title || 'No title'}
        </Text>

        <DetailRateBlock
          rating={event.rating || 0}
          ratings={event.ratings}
          commentCount={event.ratings?.length || 0}
        />

        <DetailProfileContactBlock
          phoneNumber={event.phoneNumber}
          contactName={event.title}
        />

        <View style={styles.socialContainer}>
          <DetailProfileSocialNetBlock socialMedia={event.socialMedia} />
        </View>

        <DetailsDescriptionBlock description={event.description} />

        <DetailProfileServiceBlocks services={event.services} />

        <DetailsCommentBlock
          commentCount={event.ratings.length}
          ratings={event.ratings}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default DetailProfilePage;
