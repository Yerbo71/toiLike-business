import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type PostCreateUserVendorResponse = operations['createUserVendor']['responses'][200]['content']['*/*'];
type UserVendorRequest = operations['createUserVendor']['parameters']['query']['request'];

export const postCreateUserVendor = async (
  request: UserVendorRequest,
  mainImageUri?: string,
  secondaryImageUri?: string
): Promise<PostCreateUserVendorResponse> => {
  const formData = new FormData();

  Object.entries(request).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  const addImage = (uri: string, fieldName: string) => {
    const filename = uri.split('/').pop() || `${fieldName}.jpg`;
    const type = uri.endsWith('.png') ? 'image/png' : 'image/jpeg';

    formData.append(fieldName, {
      uri,
      name: filename,
      type: `${type}`,
    } as any);
  };

  if (mainImageUri) addImage(mainImageUri, 'mainImage');
  if (secondaryImageUri) addImage(secondaryImageUri, 'secondaryImage');

  try {
    const response = await axios.post(
      `${EVENT_BASE_URL}/event-service/user-vendor/create-user-vendor`,
      formData,
      {
        transformRequest: () => formData,
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Server error:', error.response?.data);
    }
    throw error;
  }
};