import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetPlaces = operations['getEvents_1']['responses'][200]['content']['*/*'];

export const getPopularPlaces = async (): Promise<GetPlaces> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/place/get-popular-places`,
  );
  return response.data;
};
