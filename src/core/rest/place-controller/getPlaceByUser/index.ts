import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetResponse =
  operations['getPlaceByUser']['responses'][200]['content']['*/*'];

export const getPlaceByUser = async (
): Promise<GetResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/place/get-place-by-user`,
  );
  return response.data;
};
