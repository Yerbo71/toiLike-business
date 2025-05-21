import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type PostEventResponse =
  operations['createEvent']['responses'][200]['content']['*/*'];
type PostEventRequestBody =
  operations['createEvent']['requestBody']['content']['application/json'];

export const postEvent = async (
  token: string | null,
  eventData: PostEventRequestBody,
): Promise<PostEventResponse> => {
  const response = await axios.post(
    `${EVENT_BASE_URL}/event-service/event/create-event`,
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
