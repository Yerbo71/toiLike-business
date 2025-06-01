import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetResponse =
  operations['findApprovalEvents']['responses'][200]['content']['*/*'];

export const getFindApprovalEvents = async (
  page: number,
  size: number,
): Promise<GetResponse> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/event-vendor/find-approval-events`,
    {
      params: {
        page,
        size,
      },
    },
  );
  return response.data;
};
