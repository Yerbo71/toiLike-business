import React, { useState } from 'react';
import {
  Button,
  Divider,
  IconButton,
  Menu,
  Modal,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useI18n } from '@/src/context/LocaleContext';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { VendorServiceType } from '@/src/constants/mock/values';

interface SearchParams {
  page: number;
  size: number;
  q: string;
  serviceType?: VendorServiceType;
  minCost?: number;
  maxCost?: number;
  minExperience?: number;
  maxExperience?: number;
}

interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
  searchParams: SearchParams;
  sliderValues: { cost: number[]; experience: number[] };
  applyFilters: (
    newParams: Partial<SearchParams>,
    newSliderValues: { cost: number[]; experience: number[] },
  ) => void;
}

export const VendorsFilterModal = ({
  visible,
  onDismiss,
  searchParams,
  sliderValues,
  applyFilters,
}: ModalProps) => {
  const { t } = useI18n();
  const theme = useTheme();
  const [sizeMenuVisible, setSizeMenuVisible] = useState(false);
  const [serviceTypeMenuVisible, setServiceTypeMenuVisible] = useState(false);
  const [tempSearchParams, setTempSearchParams] = useState(searchParams);
  const [tempSliderValues, setTempSliderValues] = useState(sliderValues);

  const serviceTypeLabels = {
    PRESENTERS: t('vendorsPage.serviceTypes.PRESENTERS'),
    SINGERS: t('vendorsPage.serviceTypes.SINGERS'),
    DANCERS: t('vendorsPage.serviceTypes.DANCERS'),
    GROUP: t('vendorsPage.serviceTypes.GROUP'),
    OPERATORS: t('vendorsPage.serviceTypes.OPERATORS'),
    PHOTOGRAPH: t('vendorsPage.serviceTypes.PHOTOGRAPH'),
    MOBILOGRAPH: t('vendorsPage.serviceTypes.MOBILOGRAPH'),
    TRANSPORT: t('vendorsPage.serviceTypes.TRANSPORT'),
    DECORATORS: t('vendorsPage.serviceTypes.DECORATORS'),
    ANIMATORS: t('vendorsPage.serviceTypes.ANIMATORS'),
    TECHNICAL_STAFF: t('vendorsPage.serviceTypes.TECHNICAL_STAFF'),
    SECURITY: t('vendorsPage.serviceTypes.SECURITY'),
    SOUND_ENGINEERS: t('vendorsPage.serviceTypes.SOUND_ENGINEERS'),
    MEDICAL_WORKERS: t('vendorsPage.serviceTypes.MEDICAL_WORKERS'),
    STYLISTS: t('vendorsPage.serviceTypes.STYLISTS'),
    TECHNICAL_EQUIPMENT: t('vendorsPage.serviceTypes.TECHNICAL_EQUIPMENT'),
    HAIR_DRESSERS: t('vendorsPage.serviceTypes.HAIR_DRESSERS'),
    CLOTHING_SUPPLIERS: t('vendorsPage.serviceTypes.CLOTHING_SUPPLIERS'),
    FLOWER_SUPPLIERS: t('vendorsPage.serviceTypes.FLOWER_SUPPLIERS'),
  };

  const CustomLabel = ({ text, ...props }: any) => (
    <View {...props}>
      <Text
        style={{
          ...styles.labelText,
          color: theme.colors.onSurface,
          backgroundColor: theme.colors.elevation.level2,
        }}
      >
        {text}
      </Text>
    </View>
  );

  const handleSizeChange = (newSize: number) => {
    setSizeMenuVisible(false);
    setTempSearchParams((prev) => ({ ...prev, size: newSize }));
  };

  const handleServiceTypeChange = (type: VendorServiceType) => {
    setServiceTypeMenuVisible(false);
    setTempSearchParams((prev) => ({ ...prev, serviceType: type }));
  };

  const handleCostSliderChange = (values: number[]) => {
    setTempSliderValues((prev) => ({ ...prev, cost: values }));
    setTempSearchParams((prev) => ({
      ...prev,
      minCost: values[0],
      maxCost: values[1],
    }));
  };

  const handleExperienceSliderChange = (values: number[]) => {
    setTempSliderValues((prev) => ({ ...prev, experience: values }));
    setTempSearchParams((prev) => ({
      ...prev,
      minExperience: values[0],
      maxExperience: values[1],
    }));
  };

  const handleApplyFilters = () => {
    applyFilters(tempSearchParams, tempSliderValues);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('system.filters')}</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
            style={styles.closeButton}
          />
        </View>
        <Divider />

        <ScrollView style={styles.content}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>
              {t('vendorsPage.costRange')}:{' '}
              {tempSliderValues.cost[0].toLocaleString()}₸ -{' '}
              {tempSliderValues.cost[1].toLocaleString()}₸
            </Text>
            <MultiSlider
              values={tempSliderValues.cost}
              min={0}
              max={1000000}
              step={1000}
              allowOverlap={false}
              snapped
              markerStyle={{
                ...styles.marker,
                backgroundColor: theme.colors.primary,
              }}
              selectedStyle={{
                ...styles.selectedRail,
                backgroundColor: theme.colors.primary,
              }}
              trackStyle={styles.rail}
              containerStyle={styles.sliderContainer}
              onValuesChange={handleCostSliderChange}
              customLabel={CustomLabel}
            />
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>
              {t('vendorsPage.experienceRange')}:{' '}
              {tempSliderValues.experience[0].toLocaleString()} -{' '}
              {tempSliderValues.experience[1].toLocaleString()}{' '}
              {t('system.year')}
            </Text>
            <MultiSlider
              values={tempSliderValues.experience}
              min={0}
              max={50}
              step={1}
              allowOverlap={false}
              snapped
              markerStyle={{
                ...styles.marker,
                backgroundColor: theme.colors.primary,
              }}
              selectedStyle={{
                ...styles.selectedRail,
                backgroundColor: theme.colors.primary,
              }}
              trackStyle={styles.rail}
              containerStyle={styles.sliderContainer}
              onValuesChange={handleExperienceSliderChange}
              customLabel={CustomLabel}
            />
          </View>
          <Menu
            visible={serviceTypeMenuVisible}
            onDismiss={() => setServiceTypeMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setServiceTypeMenuVisible(true)}
                style={styles.filterButton}
                icon="format-list-bulleted-type"
              >
                {tempSearchParams.serviceType
                  ? serviceTypeLabels[tempSearchParams.serviceType]
                  : t('vendorsPage.selectServiceType')}
              </Button>
            }
          >
            {Object.entries(serviceTypeLabels).map(([key, label]) => (
              <Menu.Item
                key={key}
                onPress={() =>
                  handleServiceTypeChange(key as VendorServiceType)
                }
                title={label}
              />
            ))}
          </Menu>
          <Menu
            visible={sizeMenuVisible}
            onDismiss={() => setSizeMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setSizeMenuVisible(true)}
                style={styles.filterButton}
                icon="format-list-numbered"
              >
                {t('system.size')}: {tempSearchParams.size}
              </Button>
            }
          >
            <Menu.Item onPress={() => handleSizeChange(10)} title="10" />
            <Menu.Item onPress={() => handleSizeChange(20)} title="20" />
            <Menu.Item onPress={() => handleSizeChange(30)} title="30" />
          </Menu>
        </ScrollView>

        <Divider />
        <View style={styles.footer}>
          <Button mode="contained" onPress={handleApplyFilters}>
            {t('system.apply')}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  filterTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  sliderContainer: {
    height: 40,
  },
  rail: {
    backgroundColor: '#e0e0e0',
    height: 4,
    borderRadius: 2,
  },
  selectedRail: {
    height: 4,
    borderRadius: 2,
  },
  marker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 2,
  },
  labelText: {
    position: 'absolute',
    bottom: 25,
    fontSize: 12,
    padding: 4,
    borderRadius: 4,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  closeButton: {
    margin: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  content: {
    padding: 16,
    maxHeight: '70%',
  },
  footer: {
    padding: 16,
  },
  filterButton: {
    marginBottom: 8,
  },
});
