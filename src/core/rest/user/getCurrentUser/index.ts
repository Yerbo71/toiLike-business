import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetCurrentUserResponse =
  operations['getCurrentUser']['responses'][200]['content']['*/*'];

export const getCurrentUser = async (
  token: string,
): Promise<GetCurrentUserResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/user/get-current-user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
