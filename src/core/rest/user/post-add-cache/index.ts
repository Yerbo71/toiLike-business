import axios from 'axios';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

export const postAddCache = async (
  amount: string
): Promise<unknown> => {
  const response = await axios.post(
    `${EVENT_BASE_URL}/event-service/user/add-cache/${amount}`,null,
    {
      headers: {
        'accept': '*/*',
      }
    }
  );
  return response.data;
};