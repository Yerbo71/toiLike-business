import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useI18n } from '@/src/context/LocaleContext';

interface Rating {
  rating: number;
  comment?: string;
  user?: {
    username: string;
    avatarUrl?: string;
  };
  date?: string;
}

interface DetailRateBlockProps {
  ratings: Rating[];
  commentCount: number;
}

const DetailsCommentBlock: React.FC<DetailRateBlockProps> = ({
  ratings = [],
  commentCount = 0,
}) => {
  const theme = useTheme();
  const { t } = useI18n();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          {t('detailsPage.customersReviews')}
        </Text>
        <View style={styles.commentCount}>
          <AntDesign name="message1" size={16} color={theme.colors.primary} />
          <Text style={[styles.countText, { color: theme.colors.primary }]}>
            {commentCount}
          </Text>
        </View>
      </View>

      {ratings.length > 0 ? (
        ratings.slice(0, 3).map((review, index) => (
          <View
            key={`review-${index}`}
            style={[
              styles.reviewItem,
              index !== ratings.length - 1 && styles.reviewItemBorder,
              { borderColor: theme.colors.outline },
            ]}
          >
            <View style={styles.reviewHeader}>
              <View style={styles.userInfo}>
                {review.user?.avatarUrl ? (
                  <Avatar.Image
                    source={{ uri: review.user?.avatarUrl }}
                    size={30}
                  />
                ) : (
                  <MaterialIcons
                    name="person"
                    size={20}
                    color={theme.colors.primary}
                    style={styles.userIcon}
                  />
                )}
                <Text
                  style={[styles.reviewUser, { color: theme.colors.onSurface }]}
                >
                  {review.user?.username || 'Anonymous'}
                </Text>
              </View>
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={16} color="#FFD700" />
                <Text
                  style={[styles.ratingText, { color: theme.colors.onSurface }]}
                >
                  {review.rating.toFixed(1)}
                </Text>
              </View>
            </View>

            {review.comment && (
              <Text
                style={[
                  styles.reviewComment,
                  { color: theme.colors.onSurface },
                ]}
              >
                "{review.comment}"
              </Text>
            )}

            <Text
              style={[
                styles.reviewDate,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {formatDate(review.date)}
            </Text>
          </View>
        ))
      ) : (
        <Text
          style={[styles.noReviews, { color: theme.colors.onSurfaceVariant }]}
        >
          No reviews yet
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  commentCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontWeight: '500',
    fontSize: 14,
  },
  reviewItem: {
    paddingVertical: 12,
  },
  reviewItemBorder: {
    borderBottomWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userIcon: {
    marginRight: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
    padding: 2,
  },
  reviewUser: {
    fontWeight: '500',
    fontSize: 15,
    flexShrink: 1,
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  ratingText: {
    fontWeight: '600',
    fontSize: 14,
    minWidth: 30,
    textAlign: 'right',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  reviewDate: {
    fontSize: 12,
    textAlign: 'right',
  },
  noReviews: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
});

export default DetailsCommentBlock;
