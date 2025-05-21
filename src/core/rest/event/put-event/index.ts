import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type PutEventRequest =
  operations['updateEvent']['requestBody']['content']['application/json'];
type PutEventResponse =
  operations['updateEvent']['responses']['200']['content']['*/*'];

export const putEvent = async (
  token: string | null,
  id: string,
  eventData: PutEventRequest,
): Promise<PutEventResponse> => {
  const response = await axios.put(
    `${EVENT_BASE_URL}/event-service/event/update-event/${id}`,
    eventData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
