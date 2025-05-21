import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  Card,
  TextInput,
  Text,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

type Role = 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

const ChatPage = () => {
  const { model } = useLocalSearchParams<{ model: 'gpt' | 'gemini' }>();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello?' },
  ]);
  const scrollRef = useRef<ScrollView>(null);
  const theme = useTheme();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      let reply: string;

      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Произошла ошибка при обработке запроса',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <ScrollView style={styles.chatContainer} ref={scrollRef}>
            {messages.map((msg, idx) => (
              <Card
                key={idx}
                mode="contained"
                style={[
                  styles.messageCard,
                  msg.role === 'user'
                    ? styles.userMessage
                    : styles.assistantMessage,
                  {
                    backgroundColor:
                      msg.role === 'user'
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                  },
                ]}
              >
                <Card.Content>
                  <Text variant="bodyMedium">{msg.content}</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              mode="outlined"
              placeholder="Введите сообщение"
              value={input}
              onChangeText={setInput}
              style={styles.input}
              theme={{ roundness: 20 }}
            />
            <IconButton
              icon="send"
              mode="contained"
              size={24}
              onPress={handleSend}
              style={styles.sendButton}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageCard: {
    maxWidth: '80%',
    marginVertical: 4,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    margin: 0,
  },
});
