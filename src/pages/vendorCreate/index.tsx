import React, { FC, useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  View,
  Image, useColorScheme
} from 'react-native';
import { useI18n } from '@/src/context/LocaleContext';
import { Controller, useForm } from 'react-hook-form';
import { CTextInput } from '@/src/shared';
import {
  Button,
  Icon,
  Surface,
  Text, useTheme
} from 'react-native-paper';
import { AuthContext } from '@/src/context/AuthContext';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import type { operations } from '@/src/types/api2';
import { postCreateUserVendor } from '@/src/core/rest/user-vendor-controller';
import { Picker } from '@react-native-picker/picker';
import { serviceTypes } from '@/src/constants/mock/values';

interface Props {
  vendorCreateData?: operations['createUserVendor']['responses'][200]['content']['*/*'];
}

type FormData = operations['createUserVendor']['parameters']['query']['request'];

const VendorCreatePage: FC<Props> = ({ vendorCreateData }) => {
  const { t } = useI18n();
  const { token } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(vendorCreateData?.mainImage || null);
  const [secondaryImage, setSecondaryImage] = useState<string | null>(vendorCreateData?.secondaryImage || null);

  const {
    control,
    handleSubmit,
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      title: vendorCreateData?.title || '',
      description: vendorCreateData?.description || '',
      experience: vendorCreateData?.experience || 0,
      averageCost: vendorCreateData?.averageCost || 0,
      mainImage: vendorCreateData?.mainImage || '',
      secondaryImage: vendorCreateData?.secondaryImage || '',
      serviceType: vendorCreateData?.serviceType as typeof serviceTypes[number] || 'PRESENTERS',
    },
  });

  const pickImage = async (isMain: boolean) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (isMain) {
        setMainImage(result.assets[0].uri);
      } else {
        setSecondaryImage(result.assets[0].uri);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await postCreateUserVendor(data, mainImage || undefined, secondaryImage || undefined);
      Toast.show({
        type: 'success',
        text1: t('vendorCreatePage.vendorCreated'),
        text2: t('vendorCreatePage.vendorCreatedSuccess'),
      });
      router.replace('/(protected)/(application)/myServices');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (err as Error).message || t('system.error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={['#6200ee', '#ff6b6b']} style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('vendorCreatePage.headerTitle')}
        </Text>
        <Text style={styles.headerDescription}>
          {t('vendorCreatePage.headerDescription')}
        </Text>
      </LinearGradient>
      <Animated.View
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Surface style={styles.inputCard}>
          <CTextInput
            control={control}
            name="title"
            label={t('vendorCreatePage.vendorTitle')}
            rules={{
              required: t('vendorCreatePage.vendorTitle') + ' ' + t('system.isRequired'),
            }}
          />

          <CTextInput
            control={control}
            name="description"
            label={t('vendorCreatePage.description')}
            rules={{
              required: t('vendorCreatePage.description') + ' ' + t('system.isRequired'),
            }}
            multiline
          />

          <View style={{...styles.pickerContainer, borderColor: colorScheme === 'dark' ? '#838383' : '#777777'}}>
            <Text style={{...styles.pickerLabel, color: theme.colors.inverseSurface}}>{t('vendorCreatePage.serviceType')}</Text>
            <Controller
              control={control}
              name="serviceType"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={{...styles.picker,backgroundColor: theme.colors.surface,color: theme.colors.inverseSurface}}
                >
                  {serviceTypes.map((type) => (
                    <Picker.Item
                      key={type}
                      label={t(`serviceTypes.${type}`)}
                      value={type}
                    />
                  ))}
                </Picker>
              )}
            />
          </View>

          <CTextInput
            control={control}
            name="experience"
            label={t('vendorCreatePage.experience')}
            rules={{
              required: t('vendorCreatePage.experience') + ' ' + t('system.isRequired'),
            }}
          />

          <CTextInput
            control={control}
            name="averageCost"
            label={t('vendorCreatePage.averageCost')}
            rules={{
              required: t('vendorCreatePage.averageCost') + ' ' + t('system.isRequired'),
            }}
          />

          <Text style={styles.sectionHeader}>
            <Icon source="image" size={18} />
            {'  '}
            {t('vendorCreatePage.mainImage')}
          </Text>

          <View style={styles.imageContainer}>
            {mainImage ? (
              <Image source={{ uri: mainImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholder} />
            )}
            <Button
              mode="outlined"
              onPress={() => pickImage(true)}
              style={styles.imageButton}
            >
              {mainImage ? t('system.change') : t('system.choose')}
            </Button>
          </View>

          <Text style={styles.sectionHeader}>
            <Icon source="image-multiple" size={18} />
            {'  '}
            {t('vendorCreatePage.secondaryImage')}
          </Text>

          <View style={styles.imageContainer}>
            {secondaryImage ? (
              <Image source={{ uri: secondaryImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholder} />
            )}
            <Button
              mode="outlined"
              onPress={() => pickImage(false)}
              style={styles.imageButton}
            >
              {secondaryImage ? t('system.change') : t('system.choose')}
            </Button>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
            labelStyle={styles.submitButtonLabel}
          >
            {t('system.send')}
          </Button>
        </Surface>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    padding: 20,
    justifyContent: 'flex-end',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  pickerLabel: {
    padding: 8,
  },
  picker: {
    width: '100%',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
    paddingBottom: 40,
  },
  inputCard: {
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    padding: 15,
    gap: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    paddingLeft: 10,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  imageButton: {
    flex: 1,
  },
});

export default VendorCreatePage;