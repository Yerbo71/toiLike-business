import axios from 'axios';
import { AUTH_BASE_URL } from '@/src/constants/api/apiConst';

export const postAddCache = async (
  amount: string
): Promise<unknown> => {
  const response = await axios.post(
    `${AUTH_BASE_URL}/event-service/user/add-cache/${amount}`
  );
  return response.data;
};