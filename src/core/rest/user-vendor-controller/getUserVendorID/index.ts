import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetResponse =
  operations['getUserVendorById']['responses'][200]['content']['*/*'];

export const getUserVendorID = async (id: string | number
): Promise<GetResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/user-vendor/get-user-vendor/${id}`,
  );
  return response.data;
};
