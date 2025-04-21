import axios from 'axios';

export const askChatGPT = async (message: string) => {
  const apiKey = process.env.EXPO_PUBLIC_API_CHAT_GPT_API_KEY;
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  return response.data.choices[0].message.content;
};
