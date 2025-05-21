import axios from 'axios';
import type { operations } from '@/src/types/api';
import { AUTH_BASE_URL } from '@/src/constants/api/apiConst';

export const sendResetCode = async (
  pathParams: operations['sendResetCode']['parameters']['path'],
): Promise<operations['sendResetCode']['responses'][200]['content']['*/*']> => {
  const response = await axios.post(
    `${AUTH_BASE_URL}/auth-service/auth/send-reset-code/${pathParams.email}`,
    null,
  );
  return response.data;
};
