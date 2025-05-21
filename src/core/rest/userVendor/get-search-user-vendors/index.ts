import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type GetUserVendorsSearch =
  operations['searchUserVendors']['responses'][200]['content']['*/*'];
type GetUserVendorsSearchParams = NonNullable<
  operations['searchUserVendors']['parameters']['query']
>;

export const getUserVendorsSearch = async (
  params: GetUserVendorsSearchParams,
): Promise<GetUserVendorsSearch> => {
  const response = await axios.get(
    `${EVENT_BASE_URL}/event-service/user-vendor/search-user-vendors`,
    {
      params,
    },
  );
  return response.data;
};
