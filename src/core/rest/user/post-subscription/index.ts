import axios from 'axios';
import { AUTH_BASE_URL } from '@/src/constants/api/apiConst';
import { components } from '@/src/types/api2';

export const postSubscription = async (
  subscriptionId: number
): Promise<components["schemas"]["UserSubscription"]> => {
  const response = await axios.post(
    `${AUTH_BASE_URL}/event-service/user/subscriptions/${subscriptionId}`
  );
  return response.data;
};