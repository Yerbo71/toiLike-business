import axios from 'axios';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';


export const deleteUserVendor = async (id: string | number
) => {
  const response = await axios.delete(
    `${EVENT_BASE_URL}/event-service/user-vendor/delete/${id}`,
  );
  return response.data;
};
