import axios from 'axios';

export const generateGeminiResponse = async (
  prompt: string,
): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_API_GEMINI_API_KEY;
  try {
    const response = await axios.post(
      `"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Error from Gemini API';
  }
};
