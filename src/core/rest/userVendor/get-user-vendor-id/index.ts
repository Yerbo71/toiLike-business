import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

export const getUserVendorId = async (
  id: number,
): Promise<
  operations['getUserVendorById']['responses'][200]['content']['*/*']
> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/user-vendor/get-user-vendor/${id}`,
  );
  return response.data;
};
