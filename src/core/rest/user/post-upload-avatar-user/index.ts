import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

export const postUploadAvatarUser = async (
  token: string,
  imageUri: string,
): Promise<operations['uploadAvatar']['responses'][200]['content']['*/*']> => {
  const formData = new FormData();
  const file = {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  };
  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as unknown as Blob);

  const response = await axios.post(
    `${EVENT_BASE_URL}/event-service/user/upload-avatar`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
