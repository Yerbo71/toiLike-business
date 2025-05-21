import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetRatingPlace =
  operations['getUserVendorRating_1']['responses'][200]['content']['*/*'];

export const getRatingPlace = async (id: number): Promise<GetRatingPlace> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/place/get-rating/${id}`,
    {},
  );
  return response.data;
};
