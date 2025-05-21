import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

export const postUploadSecondaryUser = async (
  token: string,
  fileUri: string,
): Promise<
  operations['uploadSecondaryImage']['responses'][200]['content']['*/*']
> => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'background.jpg',
  } as unknown as Blob);

  const response = await axios.post(
    `${EVENT_BASE_URL}/event-service/user/upload-secondary`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
