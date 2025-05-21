import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { useI18n } from '@/src/context/LocaleContext';

interface Props {
  experience?: string;
  averageCost?: number;
  serviceType?: string;
  location?: string;
}

const VendorBasicBlock: React.FC<Props> = ({
  experience,
  averageCost,
  serviceType,
  location,
}) => {
  const theme = useTheme();
  const { t } = useI18n();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
    >
      <View style={styles.innerContainer}>
        {experience && (
          <View style={styles.detailItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <FontAwesome
                name="certificate"
                size={16}
                color={theme.colors.primary}
              />
            </View>
            <Text
              variant="bodyMedium"
              style={[styles.text, { color: theme.colors.onSurface }]}
            >
              {t('system.experience')} {experience}{' '}
              {+experience === 1 ? t('system.year') : t('system.years')}{' '}
            </Text>
          </View>
        )}

        {averageCost && (
          <View style={styles.detailItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialIcons
                name="attach-money"
                size={16}
                color={theme.colors.primary}
              />
            </View>
            <Text
              variant="bodyMedium"
              style={[styles.text, { color: theme.colors.onSurface }]}
            >
              {t('system.avg_cost')}: {averageCost.toLocaleString()} ₸
            </Text>
          </View>
        )}

        {serviceType && (
          <View style={styles.detailItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <MaterialIcons
                name="category"
                size={16}
                color={theme.colors.primary}
              />
            </View>
            <Text
              variant="bodyMedium"
              style={[styles.text, { color: theme.colors.onSurface }]}
            >
              {serviceType}
            </Text>
          </View>
        )}

        {location && (
          <View style={styles.detailItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Entypo
                name="location-pin"
                size={16}
                color={theme.colors.primary}
              />
            </View>
            <Text
              variant="bodyMedium"
              style={[styles.text, { color: theme.colors.onSurface }]}
            >
              {location}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
  },
  innerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  text: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});

export default VendorBasicBlock;
