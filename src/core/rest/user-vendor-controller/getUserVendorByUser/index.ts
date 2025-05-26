import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetResponse =
  operations['getUserVendorByUser']['responses'][200]['content']['*/*'];

export const getUserVendorByUser = async (
): Promise<GetResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/user-vendor/get-user-vendor-by-user`,
  );
  return response.data;
};
