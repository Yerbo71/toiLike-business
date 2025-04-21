import React, { FC } from 'react';
import {
  GestureResponderEvent,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { RatingChip } from '@/src/shared/ratingChip';
import Entypo from '@expo/vector-icons/Entypo';

interface Props {
  image: ImageSourcePropType;
  title: string;
  description: string;
  rating?: number;
  location?: string;
  onPress: (event: GestureResponderEvent) => void;
}

export const PreviewCard: FC<Props> = ({
  image,
  title,
  description,
  onPress,
  rating = 10,
  location = 'Almaty',
}) => {
  const theme = useTheme();

  return (
    <Card
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      elevation={2}
    >
      <Card.Cover
        source={image || { uri: 'https://picsum.photos/701' }}
        style={styles.cover}
      />

      <RatingChip rating={rating} />

      <Card.Content style={styles.content}>
        <Text
          variant="titleMedium"
          style={[styles.title, { color: theme.colors.onSurface }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        <Text
          variant="bodyMedium"
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
      </Card.Content>

      <View style={styles.footer}>
        <Entypo
          name="location-pin"
          size={16}
          color={theme.colors.primary}
          style={styles.locationIcon}
        />
        <Text
          variant="bodyMedium"
          style={[styles.location, { color: theme.colors.onSurfaceVariant }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {location}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 16,
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cover: {
    height: 180,
  },
  content: {
    padding: 12,
    paddingBottom: 8,
    gap: 5,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    lineHeight: 16,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginTop: 5,
  },
  locationIcon: {
    marginRight: 4,
  },
  location: {
    fontSize: 13,
    flex: 1,
  },
});
