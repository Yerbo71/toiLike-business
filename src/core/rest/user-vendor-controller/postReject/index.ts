import axios from 'axios';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';
import { operations } from '@/src/types/api2';

export const postReject = async (
  eventVendorId: number,
): Promise<
  operations['confirmEventService']['responses'][200]['content']['*/*']
> => {
  const response = await axios.post(
    `${EVENT_BASE_URL}/event-service/event-vendor/rejecit/${eventVendorId}`,
  );
  return response.data;
};
