import React from 'react';
import { FlatList, View } from 'react-native';
import { Avatar, List, Text } from 'react-native-paper';
import { chats } from '@/src/constants/mock/chats';
import { router } from 'expo-router';
import { useI18n } from '@/src/context/LocaleContext';

const ChatsPage = () => {
  const { t } = useI18n();
  return (
    <View style={{ margin: 15 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
        {t('system.chats')}
      </Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.lastMessage}
            left={() => <Avatar.Image size={40} source={item.image} />}
            right={() => <Text>{item.time}</Text>}
            onPress={() => {
              router.push({
                pathname: '/chat/[id]',
                params: {
                  id: item.id,
                  model: item.model,
                },
              });
            }}
          />
        )}
      />
    </View>
  );
};

export default ChatsPage;
