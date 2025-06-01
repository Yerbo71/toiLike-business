import axios from 'axios';
import type { operations } from '@/src/types/api3';
import { CHAT_BASE_URL } from '@/src/constants/api/apiConst';

type GetChatResponse =
  operations['getChatHistory']['responses'][200]['content']['*/*'];

export const getChatHistory = async (
  chatId: number,
  page?: number,
  size?: number,
): Promise<GetChatResponse> => {
  const response = await axios.get(`${CHAT_BASE_URL}/chat/history/${chatId}`, {
    params: {
      page,
      size,
    },
  });
  return response.data;
};
