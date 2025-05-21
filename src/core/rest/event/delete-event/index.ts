import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

export const deleteEvent = async (
  token: string | null,
  id: string,
): Promise<operations['deleteEvent']['responses']['200']['content']['*/*']> => {
  const response = await axios.delete(
    `${EVENT_BASE_URL}/event-service/event/delete-event/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
