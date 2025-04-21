import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useI18n } from '@/src/context/LocaleContext';
import { useForm } from 'react-hook-form';
import { CTextInput } from '@/src/shared';
import { Button, Text, TextInput } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { postCreateEvent } from '@/src/core/rest/event/create-event';
import { AuthContext } from '@/src/context/AuthContext';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { useEvent } from '@/src/context/EventContext';

type FormData = {
  title: string;
  startedAt: string;
  endedAt: string;
  description: string;
  hallId: number;
  eventServices: {
    id: number;
  }[];
};

const ManualOrderingPage = () => {
  const { t, locale } = useI18n();
  const { token } = useContext(AuthContext);
  const { event } = useEvent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      startedAt: new Date().toISOString(),
      endedAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      description: '',
      hallId: event.hallId || 0,
      eventServices: [],
    },
  });

  useEffect(() => {
    setValue('hallId', event.hallId);
  }, [event.hallId, setValue]);

  const startedAt = new Date(watch('startedAt'));
  const endedAt = new Date(watch('endedAt'));
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
    setValue('startedAt', newDate.toISOString());
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
    setValue('startedAt', newDate.toISOString());
  };
  const handleEndDateChange = (date: Date) => {
    const current = formatDateTime(createSafeDate(endedAt));
    const newDate = new Date(date);
    newDate.setHours(current.dateObj.getHours(), current.dateObj.getMinutes());
    setValue('endedAt', newDate.toISOString());
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
    setValue('endedAt', newDate.toISOString());
  };

  const onSubmit = async (data: FormData) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await postCreateEvent(token, data);

      Toast.show({
        type: 'success',
        text1: 'Event Created',
        text2: 'Your event has been successfully created',
      });

      router.replace('/(application)');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (err as Error).message || 'Failed to create event',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startFormatted = formatDateTime(createSafeDate(startedAt));
  const endFormatted = formatDateTime(createSafeDate(endedAt));

  return (
    <View style={styles.container}>
      <CTextInput
        control={control}
        name="title"
        label="Event Title"
        rules={{ required: 'Title is required' }}
      />
      <CTextInput
        control={control}
        name="description"
        label="Description"
        rules={{ required: 'Description is required' }}
        multiline
      />
      <TouchableOpacity
        onPress={() => router.push('/(ordering)/hallChoose')}
        style={styles.placeInput}
      >
        <TextInput
          label="Hall"
          value={event.hallId ? `Hall ${event.place?.title}` : 'Choose Hall'}
          editable={false}
          mode="outlined"
          theme={{ roundness: 10 }}
        />
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Start Date & Time</Text>
      <View style={styles.datetimeContainer}>
        <View style={styles.dateInput}>
          <TouchableOpacity onPress={() => setStartDatePickerVisible(true)}>
            <TextInput
              theme={{ roundness: 10 }}
              style={styles.input}
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
              style={styles.input}
              label="Start Time"
              mode="outlined"
              value={startFormatted.timeStr}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      </View>
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
          startDate: new Date(), // Нельзя выбрать дату раньше сегодня
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
      <Text style={styles.sectionTitle}>End Date & Time</Text>
      <View style={styles.datetimeContainer}>
        <View style={styles.dateInput}>
          <TouchableOpacity onPress={() => setEndDatePickerVisible(true)}>
            <TextInput
              theme={{ roundness: 10 }}
              style={styles.input}
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
              style={styles.input}
              label="End Time"
              mode="outlined"
              value={endFormatted.timeStr}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      </View>
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
          startDate: startFormatted.dateObj, // Нельзя выбрать дату раньше даты начала
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
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitButton}
        labelStyle={styles.submitButtonLabel}
      >
        Create Event
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  placeInput: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
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
  input: {
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManualOrderingPage;
