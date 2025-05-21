import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { components } from '@/src/types/api2';
import { useTheme } from 'react-native-paper';
import { ServiceItem } from '@/src/pages/myApplications/components/blocks/serviceItem';
import { useI18n } from '@/src/context/LocaleContext';

interface ServiceListProps {
  services: components['schemas']['EventVendorResponse'][];
}

export const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  const theme = useTheme();
  const { t } = useI18n();
  if (!services?.length) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderLeftColor: theme.colors.primary,
        },
      ]}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="tools"
          size={20}
          color={theme.colors.tertiary}
        />
        <Text
          variant="titleSmall"
          style={[styles.title, { color: theme.colors.tertiary }]}
        >
          {t('system.services')} ({services.length})
        </Text>
      </View>

      {services.map((service) => (
        <ServiceItem key={service.id} service={service} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    marginLeft: 8,
    fontWeight: '600',
  },
});
