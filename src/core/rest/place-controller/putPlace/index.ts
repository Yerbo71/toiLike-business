import axios from 'axios';
import type { operations } from '@/src/types/api2';
import { EVENT_BASE_URL } from '@/src/constants/api/apiConst';

type PutUpdatePlaceResponse = operations['updatePlace']['responses'][200]['content']['*/*'];
type UserPlaceRequest= operations['updatePlace']['requestBody']['content']['application/json'];

export const putPlace = async (
  id: number,
  request: UserPlaceRequest,
  mainImageUri?: string,
  secondaryImageUri?: string
): Promise<PutUpdatePlaceResponse> => {
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
    const response = await axios.put(
      `${EVENT_BASE_URL}/event-service/place/update/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Full error details:', {
        config: error.config,
        request: error.request,
        response: error.response,
      });
    }
    throw error;
  }
};