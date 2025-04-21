import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetPopularEventByIDTemplates =
  operations['getById']['responses'][200]['content']['*/*'];

export const getPopularEventByIDTemplates = async (
  id: number,
): Promise<GetPopularEventByIDTemplates> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/event-template/get-by-id/${id}`,
    {},
  );
  return response.data;
};
