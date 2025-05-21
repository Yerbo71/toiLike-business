import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { AuthContext } from '@/src/context/AuthContext';
import { getAIEventReview } from '@/src/core/rest/event/get-ai-review';
import { useI18n } from '@/src/context/LocaleContext';

type Role = 'assistant';

interface Message {
  role: Role;
  content: string;
}

const GeminiChatPage = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { token } = useContext(AuthContext);
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const theme = useTheme();

  useEffect(() => {
    const loadEventAnalysis = async () => {
      if (!eventId || !token) {
        setMessages([
          {
            role: 'assistant',
            content: t('geminiChat.missingData'),
          },
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getAIEventReview(Number(eventId), token);

        setMessages([
          {
            role: 'assistant',
            content: t('geminiChat.welcomeWithEvent'),
          },
          {
            role: 'assistant',
            content: response || t('geminiChat.defaultResponse'),
          },
        ]);
      } catch (error) {
        setMessages([
          {
            role: 'assistant',
            content: t('geminiChat.errorResponse'),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventAnalysis();
  }, [eventId, token, t]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.chatContainer} ref={scrollRef}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          messages.map((msg, idx) => (
            <Card
              key={idx}
              mode="contained"
              style={[
                styles.messageCard,
                styles.assistantMessage,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Card.Content>
                <Text variant="bodyMedium">{msg.content}</Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatContainer: {
    flex: 1,
  },
  messageCard: {
    maxWidth: '80%',
    marginVertical: 8,
    borderRadius: 16,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default GeminiChatPage;
