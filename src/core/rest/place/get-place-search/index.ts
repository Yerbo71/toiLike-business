import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetPlaceSearch =
  operations['searchUserVendors_1']['responses'][200]['content']['*/*'];
type GetPlaceSearchParams = NonNullable<
  operations['searchUserVendors_1']['parameters']['query']
>;

export const getPlaceSearch = async (
  params: GetPlaceSearchParams,
): Promise<GetPlaceSearch> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/place/search`,
    {
      params,
    },
  );
  return response.data;
};
