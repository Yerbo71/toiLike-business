import axios from 'axios';
import type { operations } from '@/src/types/api';
import { AUTH_BASE_URL } from '@/src/constants/api/apiConst';

export const confirmResetCode = async (
  pathParams: operations['resetPassword']['parameters']['path'],
  queryParams: operations['resetPassword']['parameters']['query'],
): Promise<operations['resetPassword']['responses'][200]['content']['*/*']> => {
  const response = await axios.post(
    `${AUTH_BASE_URL}/auth-service/auth/confirm-reset-code/${pathParams.email}`,
    null,
    {
      params: queryParams,
    },
  );
  return response.data;
};
