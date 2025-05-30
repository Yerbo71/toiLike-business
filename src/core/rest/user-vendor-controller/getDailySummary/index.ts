import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetResponse =
  operations['getDailyInfo']['responses'][200]['content']['*/*'];

export const getDailySummary = async (  startTime: string, endTime: string
): Promise<GetResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/event-vendor/get-daily-summary`,
    {
      params: {
        startTime,
        endTime
      }
    }
  );
  return response.data;
};
