import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetAIEventReviewResponse =
  operations['getEvents']['responses'][200]['content']['*/*'];

export const getAIEventReview = async (
  eventId: number,
  token: string,
): Promise<GetAIEventReviewResponse> => {
  const response = await axios.post(
    `${EVENT_BASE_URL}/event-service/event/ai-review/${eventId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
