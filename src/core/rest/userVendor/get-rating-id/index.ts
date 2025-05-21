import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

export const getRatingId = async (
  id: number,
): Promise<
  operations['getUserVendorRating']['responses'][200]['content']['*/*']
> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/user-vendor/get-rating/${id}`,
  );
  return response.data;
};
