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
import { Picker } from '@react-native-picker/picker';
import { cityEnums } from '@/src/constants/mock/values';
import { useQueryClient } from '@tanstack/react-query';
import { postCreatePlace, putPlace } from '@/src/core/rest/place-controller';

interface Props {
  placeCreateData?: operations['createPlace']['responses'][200]['content']['*/*'];
}

type FormData = operations['createPlace']['parameters']['query']['placeRequest'];

const PlaceCreatePage: FC<Props> = ({ placeCreateData }) => {
  const { t } = useI18n();
  const { token } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImage, setMainImage] = useState<string | undefined>(placeCreateData?.mainImage || undefined);
  const [secondaryImage, setSecondaryImage] = useState<string | undefined>(placeCreateData?.secondaryImage || undefined);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      title: placeCreateData?.title || '',
      description: placeCreateData?.description || undefined,
      cost: placeCreateData?.cost || undefined,
      cityEnum: placeCreateData?.cityEnum || 'ALMATY',
      street: placeCreateData?.street || undefined,
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
    console.log("Data being submitted: ", data);
    try {
      if (placeCreateData) {
        await putPlace(
          placeCreateData.id,
          data,
          mainImage || undefined,
          secondaryImage || undefined
        );
        Toast.show({
          type: 'success',
          text1: t('placeCreatePage.placeUpdated'),
          text2: t('placeCreatePage.placeUpdatedSuccess'),
        });
        queryClient.refetchQueries({queryKey: ['myPlaces']});
      } else {
        await postCreatePlace(
          data,
          mainImage || undefined,
          secondaryImage || undefined
        );
        Toast.show({
          type: 'success',
          text1: t('placeCreatePage.placeCreated'),
          text2: t('placeCreatePage.placeCreatedSuccess'),
        });
        queryClient.refetchQueries({queryKey: ['myPlaces']});
      }
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

  const getImageUri = (imageUri: string | undefined) => {
    if (!imageUri) return undefined;
    if (imageUri.startsWith('http') || imageUri.startsWith('https')) {
      return `${imageUri}?t=${Date.now()}`;
    }
    return imageUri;
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={['#6200ee', '#ff6b6b']} style={styles.header}>
        <Text style={styles.headerTitle}>
          {t('placeCreatePage.headerTitle')}
        </Text>
        <Text style={styles.headerDescription}>
          {t('placeCreatePage.headerDescription')}
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
            label={t('placeCreatePage.placeTitle')}
            rules={{
              required: t('placeCreatePage.placeTitle') + ' ' + t('system.isRequired'),
            }}
          />

          <CTextInput
            control={control}
            name="description"
            label={t('placeCreatePage.description')}
            rules={{
              required: t('placeCreatePage.description') + ' ' + t('system.isRequired'),
            }}
            multiline
          />

          <View style={{...styles.pickerContainer, borderColor: colorScheme === 'dark' ? '#838383' : '#777777'}}>
            <Text style={{...styles.pickerLabel, color: theme.colors.inverseSurface}}>{t('placeCreatePage.city')}</Text>
            <Controller
              control={control}
              name="cityEnum"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={{...styles.picker,backgroundColor: theme.colors.surface,color: theme.colors.inverseSurface}}
                >
                  {cityEnums.map((type) => (
                    <Picker.Item
                      key={type}
                      label={t(`cityEnums.${type}`)}
                      value={type}
                    />
                  ))}
                </Picker>
              )}
            />
          </View>

          <CTextInput
            control={control}
            name="street"
            label={t('placeCreatePage.street')}
            rules={{
              required: t('placeCreatePage.street') + ' ' + t('system.isRequired'),
            }}
          />

          <CTextInput
            control={control}
            name="cost"
            label={t('placeCreatePage.cost')}
            rules={{
              required: t('placeCreatePage.cost') + ' ' + t('system.isRequired'),
              min: {
                value: 1,
                message: t('placeCreatePage.cost') + ' must be greater than 0',
              },
              validate: (value:string) => {
                const num = Number(value);
                return !isNaN(num) && num > 0 || 'Please enter a valid amount';
              },
            }}
          />

          <Text style={styles.sectionHeader}>
            <Icon source="image" size={18} />
            {'  '}
            {t('placeCreatePage.mainImage')}
          </Text>

          <View style={styles.imageContainer}>
            {mainImage ? (
              <Image
                source={{ uri: getImageUri(mainImage) }}
                style={styles.image}
                key={`main-${Date.now()}`}
              />
            ) : (
              <View style={{...styles.placeholder,backgroundColor: theme.colors.elevation.level4,borderColor: theme.colors.inverseSurface}} >
                <Icon source="image" size={25} />
              </View>
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
            {t('placeCreatePage.secondaryImage')}
          </Text>

          <View style={styles.imageContainer}>
            {secondaryImage ? (
              <Image
                source={{ uri: getImageUri(secondaryImage) }}
                style={styles.image}
                key={`secondary-${Date.now()}`}
              />
            ) : (
              <View style={{...styles.placeholder,backgroundColor: theme.colors.elevation.level4,borderColor: theme.colors.inverseSurface}} >
                <Icon source="image" size={25} />
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  imageButton: {
    flex: 1,
  },
});

export default PlaceCreatePage;