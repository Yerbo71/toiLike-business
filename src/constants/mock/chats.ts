// @ts-ignore
import gptLogo from '@/assets/images/chatgpt.jpg';
// @ts-ignore
import geminiLogo from '@/assets/images/gemini.png';

export const chats = [
  {
    id: 'gemini',
    image: geminiLogo,
    title: 'Gemini Chat',
    lastMessage: 'Ask me anything!',
    time: '10:00 AM',
    model: 'gemini',
  },
  {
    id: 'gpt',
    image: gptLogo,
    title: 'GPT Chat',
    lastMessage: 'Ready to help.',
    time: '10:05 AM',
    model: 'gpt',
  },
];
