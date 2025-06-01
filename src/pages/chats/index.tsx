import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Avatar, List, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useI18n } from '@/src/context/LocaleContext';
import { useQuery } from '@tanstack/react-query';
import { ErrorView, LoadingView } from '@/src/shared';
import { getAllChats } from '@/src/core/rest/chat';

const ChatsPage = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['chats'],
    queryFn: getAllChats,
  });

  const onRefresh = useCallback(async () => {
    setManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setManualRefreshing(false);
    }
  }, [refetch]);

  if (isLoading && !manualRefreshing) {
    return <LoadingView />;
  }

  if (isError) {
    return <ErrorView />;
  }

  return (
    <View style={{ flex: 1, margin: 15 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
        {t('system.chats')}
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || manualRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <List.Item
            title={item.user.username}
            description={item.lastMessage}
            left={() =>
              item.user.avatar ? (
                <Avatar.Image size={40} source={{ uri: item.user.avatar }} />
              ) : (
                <Avatar.Text
                  size={40}
                  label={item.user.username.charAt(0).toUpperCase()}
                />
              )
            }
            onPress={() =>
              router.push(
                // @ts-ignore/
                `/chat/${item.id}`,
              )
            }
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            {t('system.noChats')}
          </Text>
        }
      />
    </View>
  );
};

export default ChatsPage;
