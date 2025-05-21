import axios from 'axios';
import type { operations } from '@/src/types/api';
import { AUTH_BASE_URL } from '@/src/constants/api/apiConst';

export const confirmEmail = async (
  pathParams: operations['confirmEmail']['parameters']['path'],
  queryParams: operations['confirmEmail']['parameters']['query'],
): Promise<operations['confirmEmail']['responses'][200]['content']['*/*']> => {
  const response = await axios.post(
    `${AUTH_BASE_URL}/auth-service/auth/confirm-email/${pathParams.email}`,
    null,
    {
      params: queryParams,
    },
  );
  return response.data;
};
