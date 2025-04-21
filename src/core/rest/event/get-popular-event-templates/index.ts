import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetPopularEventTemplates =
  operations['getPopularEvents']['responses'][200]['content']['*/*'];

export const getPopularEventTemplates =
  async (): Promise<GetPopularEventTemplates> => {
    const response = await axios.get(
      `${EVENT_BASE_URL}/event-service/event-template/get-popular-event-templates`,
      {},
    );
    return response.data;
  };
