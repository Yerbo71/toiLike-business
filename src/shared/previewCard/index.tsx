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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Props {
  image: ImageSourcePropType;
  title: string;
  description: string;
  rating?: number;
  location?: string;
  averageCost?: number;
  serviceType?: string;
  experience?: string;
  onPress: (event: GestureResponderEvent) => void;
}

export const PreviewCard: FC<Props> = ({
  image,
  title,
  description,
  onPress,
  rating = 10,
  location = 'Almaty',
  averageCost,
  serviceType,
  experience,
}) => {
  const theme = useTheme();
  const isDark = theme.dark;

  return (
    <Card
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? theme.colors.elevation.level1
            : theme.colors.surface,
        },
      ]}
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

      <View style={styles.detailsGrid}>
        {experience && (
          <View
            style={[
              styles.detailItem,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.03)',
              },
            ]}
          >
            <FontAwesome
              name="certificate"
              size={14}
              color={theme.colors.primary}
              style={styles.detailIcon}
            />
            <Text
              variant="bodyMedium"
              style={[
                styles.detailText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {experience}
            </Text>
          </View>
        )}

        {averageCost && (
          <View
            style={[
              styles.detailItem,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.03)',
              },
            ]}
          >
            <MaterialIcons
              name="attach-money"
              size={14}
              color={theme.colors.primary}
              style={styles.detailIcon}
            />
            <Text
              variant="bodyMedium"
              style={[
                styles.detailText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {averageCost.toLocaleString()} ₸
            </Text>
          </View>
        )}

        {serviceType && (
          <View
            style={[
              styles.detailItem,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.03)',
              },
            ]}
          >
            <MaterialIcons
              name="work"
              size={14}
              color={theme.colors.primary}
              style={styles.detailIcon}
            />
            <Text
              variant="bodyMedium"
              style={[
                styles.detailText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {serviceType}
            </Text>
          </View>
        )}

        {location && (
          <View
            style={[
              styles.detailItem,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.03)',
              },
            ]}
          >
            <Entypo
              name="location-pin"
              size={14}
              color={theme.colors.primary}
              style={styles.detailIcon}
            />
            <Text
              variant="bodyMedium"
              style={[
                styles.detailText,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {location}
            </Text>
          </View>
        )}
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
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  content: {
    padding: 12,
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
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
