import axios from 'axios';
import type { operations } from '@/src/types/api';
import { AUTH_BASE_URL } from '@/src/constants/api/apiConst';

export const login = async (
  data: operations['loginIn']['requestBody']['content']['application/json'],
): Promise<operations['loginIn']['responses'][200]['content']['*/*']> => {
  const response = await axios.post(
    `${AUTH_BASE_URL}/auth-service/auth/login-in`,
    data,
  );
  return response.data;
};
