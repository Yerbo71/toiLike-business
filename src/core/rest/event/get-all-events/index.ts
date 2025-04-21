import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetAllEvents =
  operations['getAllEventsByUser']['responses'][200]['content']['*/*'];

export const getAllEvents = async (token: string): Promise<GetAllEvents> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/event/get-all-events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
