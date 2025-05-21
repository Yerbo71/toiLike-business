import React from 'react';
import { Avatar, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { chats } from '@/src/constants/mock/chats';

export const ChatHeader = () => {
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
