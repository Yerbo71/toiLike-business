import React, { useContext, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { AuthContext } from '@/src/context/AuthContext';
import { WithoutToken } from '@/src/shared/withoutToken';
import { getEvent } from '@/src/core/rest/event/get-event';
import ManualOrderingPage from '@/src/pages/manualOrdering';
import { ActivityIndicator, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useEvent } from '@/src/context/EventContext';

export default function VendorCreate() {
  const { isAuthenticated, token } = useContext(AuthContext);
  const params = useLocalSearchParams();
  const eventId = Number(params.id);
  const { setEvent } = useEvent();

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId, token!),
    enabled: isAuthenticated && !!eventId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setEvent({
        title: data.title,
        startedAt: data.startedAt || '',
        endedAt: data.endedAt || '',
        description: data.description || '',
        placeId: data.place?.id || 0,
        eventServices: data.eventServices.map((s) => ({ id: s.id })),
      });
    }
  }, [data, setEvent]);

  if (!isAuthenticated) {
    return <WithoutToken />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading event data</Text>
      </View>
    );
  }

  return <ManualOrderingPage eventData={data} />;
}
