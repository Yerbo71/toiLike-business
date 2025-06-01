import axios from 'axios';
import type { operations } from '@/src/types/api3';
import { CHAT_BASE_URL } from '@/src/constants/api/apiConst';

type GetChatResponse =
  operations['getAllChats']['responses'][200]['content']['*/*'];

export const getAllChats = async (): Promise<GetChatResponse> => {
  const response = await axios.get(`${CHAT_BASE_URL}/chat/get-all-chats`, {});
  return response.data;
};
