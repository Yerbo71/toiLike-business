import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetResponse =
  operations['getAllBusinessSubscriptions']['responses'][200]['content']['*/*'];

export const getSubscriptionsBusiness = async (
): Promise<GetResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/user/subscriptions-business`,
  );
  return response.data;
};
