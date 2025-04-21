import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetEventResponse = operations['getEvent']['responses'][200]['content'];

export const getEvent = async (
  id: number,
  token: string,
): Promise<GetEventResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/event/get-event/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
