import React, { FC, useContext, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useI18n } from '@/src/context/LocaleContext';
import { useForm } from 'react-hook-form';
import { CTextInput } from '@/src/shared';
import {
  Button,
  HelperText,
  Icon,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { postEvent } from '@/src/core/rest/event';
import { AuthContext } from '@/src/context/AuthContext';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { useEvent } from '@/src/context/EventContext';
import { LinearGradient } from 'expo-linear-gradient';
import type { components } from '@/src/types/api2';

interface Props {
  eventData?: components['schemas']['EventResponse'];
}

type FormData = {
  title: string;
  startedAt: string;
  endedAt: string;
  description: string;
  placeId: number;
  eventServices: {
    id: number;
  }[];
};

const ManualOrderingPage: FC<Props> = ({ eventData }) => {
  const { t, locale } = useI18n();
  const { token } = useContext(AuthContext);
  const { event, resetEvent } = useEvent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      title: eventData?.title || '',
      description: eventData?.description || '',
      startedAt: eventData?.startedAt || new Date().toISOString(),
      endedAt:
        eventData?.endedAt ||
        new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      placeId: eventData?.place?.id || 0,
      eventServices: eventData?.eventServices?.map((s) => ({ id: s.id })) || [],
    },
  });
  console.log('eventData', eventData);

  const startedAt = new Date(watch('startedAt'));
  const endedAt = new Date(watch('endedAt'));
  const placeId = watch('placeId');
  const eventServices = watch('eventServices');

  useEffect(() => {
    if (event.placeId) {
      setValue('placeId', event.placeId);
    }
    if (event.eventServices.length > 0) {
      setValue('eventServices', event.eventServices);
    }
  }, [event.placeId, event.eventServices]);

  const createSafeDate = (date?: Date | string | number) => {
    try {
      const d = date ? new Date(date) : new Date();
      return isNaN(d.getTime()) ? new Date() : d;
    } catch {
      return new Date();
    }
  };

  const formatDateTime = (date: Date) => ({
    dateStr: date.toLocaleDateString(locale === 'kz' ? 'ru-RU' : 'en-US'),
    timeStr: date.toLocaleTimeString(locale === 'kz' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    dateObj: date,
  });

  const handleStartDateChange = (date: Date) => {
    const current = formatDateTime(createSafeDate(startedAt));
    const newDate = new Date(date);
    newDate.setHours(current.dateObj.getHours(), current.dateObj.getMinutes());
    setValue('startedAt', newDate.toISOString(), { shouldValidate: true });
  };

  const handleStartTimeChange = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    const current = formatDateTime(createSafeDate(startedAt));
    const newDate = new Date(current.dateObj);
    newDate.setHours(hours, minutes);
    setValue('startedAt', newDate.toISOString(), { shouldValidate: true });
  };

  const handleEndDateChange = (date: Date) => {
    const current = formatDateTime(createSafeDate(endedAt));
    const newDate = new Date(date);
    newDate.setHours(current.dateObj.getHours(), current.dateObj.getMinutes());
    setValue('endedAt', newDate.toISOString(), { shouldValidate: true });
  };

  const handleEndTimeChange = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    const current = formatDateTime(createSafeDate(endedAt));
    const newDate = new Date(current.dateObj);
    newDate.setHours(hours, minutes);
    setValue('endedAt', newDate.toISOString(), { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await postEvent(token, data);
      Toast.show({
        type: 'success',
        text1: t('manualOrderingPage.eventCreated'),
        text2: t('manualOrderingPage.eventCreatedSuccess'),
      });

      router.replace('/(application)');
      reset();
      resetEvent();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          (err as Error).message || t('manualOrderingPage.eventCreationError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startFormatted = formatDateTime(createSafeDate(startedAt));
  const endFormatted = formatDateTime(createSafeDate(endedAt));

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
          {t('manualOrderingPage.headerTitle')}
        </Text>
        <Text style={styles.headerDescription}>
          {t('manualOrderingPage.headerDescription')}
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
            label={t('manualOrderingPage.eventTitle')}
            rules={{
              required:
                t('manualOrderingPage.eventTitle') +
                ' ' +
                t('system.isRequired'),
            }}
          />
          <CTextInput
            control={control}
            name="description"
            label={t('manualOrderingPage.description')}
            rules={{
              required:
                t('manualOrderingPage.description') +
                ' ' +
                t('system.isRequired'),
            }}
            multiline
          />
          <Text style={styles.sectionHeader}>
            <Icon source="animation" size={18} />
            {'  '}
            {t('manualOrderingPage.choosingServices')}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(ordering)/placeChoose')}
          >
            <CTextInput
              control={control}
              name="placeId"
              label={t('manualOrderingPage.place')}
              rules={{
                required:
                  t('manualOrderingPage.place') + ' ' + t('system.isRequired'),
                validate: (value: number) =>
                  value > 0 ||
                  t('manualOrderingPage.place') + ' ' + t('system.isRequired'),
              }}
              editable={false}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(ordering)/vendorsChoose')}
          >
            <CTextInput
              control={control}
              name="eventServices"
              label={t('manualOrderingPage.vendors')}
              rules={{
                required:
                  t('manualOrderingPage.vendors') +
                  ' ' +
                  t('system.isRequired'),
                validate: (value: number[]) =>
                  value.length > 0 ||
                  t('manualOrderingPage.vendors') +
                    ' ' +
                    t('system.isRequired'),
              }}
              editable={false}
            />
          </TouchableOpacity>

          <Text style={styles.sectionHeader}>
            <Icon source="av-timer" size={18} />
            {'  '}
            {t('manualOrderingPage.choosingDate')}
          </Text>
          <View style={styles.datetimeContainer}>
            <View style={styles.dateInput}>
              <TouchableOpacity onPress={() => setStartDatePickerVisible(true)}>
                <TextInput
                  theme={{ roundness: 10 }}
                  label="Start Date"
                  mode="outlined"
                  value={startFormatted.dateStr}
                  editable={false}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.timeInput}>
              <TouchableOpacity onPress={() => setStartTimePickerVisible(true)}>
                <TextInput
                  theme={{ roundness: 10 }}
                  label="Start Time"
                  mode="outlined"
                  value={startFormatted.timeStr}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.datetimeContainer}>
            <View style={styles.dateInput}>
              <TouchableOpacity onPress={() => setEndDatePickerVisible(true)}>
                <TextInput
                  theme={{ roundness: 10 }}
                  label="End Date"
                  mode="outlined"
                  value={endFormatted.dateStr}
                  editable={false}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.timeInput}>
              <TouchableOpacity onPress={() => setEndTimePickerVisible(true)}>
                <TextInput
                  theme={{ roundness: 10 }}
                  label="End Time"
                  mode="outlined"
                  value={endFormatted.timeStr}
                  editable={false}
                />
              </TouchableOpacity>
            </View>
          </View>
          {errors.endedAt && (
            <HelperText type="error">{errors.endedAt.message}</HelperText>
          )}
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
      <DatePickerModal
        locale={locale === 'kz' ? 'ru' : 'en'}
        mode="single"
        visible={startDatePickerVisible}
        onDismiss={() => setStartDatePickerVisible(false)}
        date={startFormatted.dateObj}
        onConfirm={({ date }) => {
          if (date) {
            handleStartDateChange(date);
          }
          setStartDatePickerVisible(false);
        }}
        validRange={{
          startDate: new Date(),
        }}
      />
      <TimePickerModal
        locale={locale}
        visible={startTimePickerVisible}
        onDismiss={() => setStartTimePickerVisible(false)}
        onConfirm={handleStartTimeChange}
        hours={startFormatted.dateObj.getHours()}
        minutes={startFormatted.dateObj.getMinutes()}
      />
      <DatePickerModal
        locale={locale === 'kz' ? 'ru' : 'en'}
        mode="single"
        visible={endDatePickerVisible}
        onDismiss={() => setEndDatePickerVisible(false)}
        date={endFormatted.dateObj}
        onConfirm={({ date }) => {
          if (date) {
            handleEndDateChange(date);
          }
          setEndDatePickerVisible(false);
        }}
        validRange={{
          startDate: startFormatted.dateObj,
        }}
      />
      <TimePickerModal
        locale={locale}
        visible={endTimePickerVisible}
        onDismiss={() => setEndTimePickerVisible(false)}
        onConfirm={handleEndTimeChange}
        hours={endFormatted.dateObj.getHours()}
        minutes={endFormatted.dateObj.getMinutes()}
      />
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
  chooseCard: {
    padding: 15,
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 16,
    color: '#666',
  },
  cardValue: {
    fontSize: 14,
    color: '#999',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  dateInput: {
    flex: 2,
  },
  timeInput: {
    flex: 1,
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
});

export default ManualOrderingPage;
