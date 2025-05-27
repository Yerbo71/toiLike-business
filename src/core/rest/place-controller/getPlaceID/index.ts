import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetResponse =
  operations['getPlace']['responses'][200]['content']['*/*'];

export const getPlaceID = async (id: string | number
): Promise<GetResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/place/get-place/${id}`,
  );
  return response.data;
};
