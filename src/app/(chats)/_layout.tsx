import React from 'react';
import { Stack } from 'expo-router';
import { Avatar, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { chats } from '@/src/constants/mock/chats';

const ChatHeader = () => {
  const { id } = useLocalSearchParams();
  const chat = chats.find((c) => c.id === id);

  if (!chat) return null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Avatar.Image size={40} source={chat.image} />
      <View>
        <Text variant="titleMedium">{chat.title}</Text>
        <Text style={{ fontSize: 12, color: 'gray' }}>{chat.time}</Text>
      </View>
    </View>
  );
};

const ChatsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: () => <ChatHeader />,
      }}
    >
      <Stack.Screen name="chat/[id]" />
    </Stack>
  );
};

export default ChatsLayout;
