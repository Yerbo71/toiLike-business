import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Avatar, Button, Text, useTheme } from 'react-native-paper';
import DetailProfileDescriptionBlock from './components/detailProfileDescriptionBlock';
import DetailProfileSocialNetBlock from './components/detailProfileSocialNetBlock';
import { DetailRateBlock } from '@/src/shared';
import { useQuery } from '@tanstack/react-query';
import { getPopularEventByIDTemplates } from '@/src/core/rest/event/get-popular-event-templates-id';
import { useLocalSearchParams } from 'expo-router';
import DetailProfileCommentBlock from '@/src/pages/details/detailProfile/components/detailProfileCommentBlock';
import DetailProfileServiceBlocks from '@/src/pages/details/detailProfile/components/detailProfileServiceBlocks';

const { width } = Dimensions.get('window');

const DetailProfile = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['eventDetails', id],
    queryFn: () => getPopularEventByIDTemplates(Number(id)),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: theme.colors.error }}>
          Failed to load event details
        </Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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

        <Button
          mode="contained"
          icon="chat"
          style={styles.messageButton}
          labelStyle={styles.buttonLabel}
        >
          Contact Organizer
        </Button>

        {/* Social Networks - Now with proper horizontal scrolling */}
        <View style={styles.socialContainer}>
          <DetailProfileSocialNetBlock />
        </View>
        <DetailProfileDescriptionBlock description={event.description} />
        <DetailProfileServiceBlocks services={event.services} />
        <DetailProfileCommentBlock
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

export default DetailProfile;
