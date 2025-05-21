import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetPopularEventByIDTemplates =
  operations['getPlace']['responses'][200]['content']['*/*'];

export const getPlace = async (
  id: number,
): Promise<GetPopularEventByIDTemplates> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/place/get-place/${id}`,
    {},
  );
  return response.data;
};
