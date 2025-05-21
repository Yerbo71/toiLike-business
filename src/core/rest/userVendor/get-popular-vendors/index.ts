import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

export const getPopularVendors = async (): Promise<
  operations['getUserVendor']['responses'][200]['content']['*/*']
> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/user-vendor/get-popular-vendors`,
  );
  return response.data;
};
