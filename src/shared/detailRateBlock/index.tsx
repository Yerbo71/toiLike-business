import React from 'react';
import { View, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text, useTheme } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface Rating {
  rating: number;
  comment?: string;
  user?: {
    username: string;
  };
  date?: string;
}

interface DetailRateBlockProps {
  rating: number;
  ratings?: Rating[];
  commentCount?: number;
  showDetails?: boolean;
}

export const DetailRateBlock: React.FC<DetailRateBlockProps> = ({
  rating = 0,
  ratings = [],
  commentCount = 0,
  showDetails = false,
}) => {
  const theme = useTheme();
  const roundedRating = Math.round(rating * 10) / 10;

  const getRatingColor = () => {
    if (rating >= 8) return '#4CAF50';
    if (rating >= 6) return '#FFC107';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <View
          style={[styles.ratingPill, { backgroundColor: getRatingColor() }]}
        >
          <AntDesign name="star" size={16} color="white" />
          <Text style={styles.ratingText}>{roundedRating}</Text>
        </View>

        <View style={styles.commentContainer}>
          <FontAwesome
            name="comment"
            size={16}
            color={theme.colors.onSurface}
          />
          <Text style={[styles.commentText, { color: theme.colors.onSurface }]}>
            {commentCount}
          </Text>
        </View>
      </View>

      {showDetails && ratings.length > 0 && (
        <View style={styles.detailsContainer}>
          <Text
            style={[styles.detailsTitle, { color: theme.colors.onSurface }]}
          >
            Recent Reviews
          </Text>
          {ratings.slice(0, 2).map((review, index) => (
            <View key={`review-${index}`} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <MaterialIcons
                  name="person"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.reviewUser, { color: theme.colors.onSurface }]}
                >
                  {review.user?.username || 'Anonymous'}
                </Text>
                <Text
                  style={[
                    styles.reviewDate,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {review.date}
                </Text>
              </View>
              <Text
                style={[
                  styles.reviewComment,
                  { color: theme.colors.onSurface },
                ]}
              >
                {review.comment}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentText: {
    fontWeight: '500',
    fontSize: 14,
  },
  detailsContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  detailsTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  reviewItem: {
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  reviewUser: {
    fontWeight: '500',
    fontSize: 14,
  },
  reviewDate: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DetailRateBlock;
