import React, { useState, useRef, useContext, useEffect } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { getChatHistory } from '@/src/core/rest/chat';
import { AuthContext } from '@/src/context/AuthContext';
import { LoadingView } from '@/src/shared';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { CHAT_WEB_SOCKET_BASE_URL } from '@/src/constants/api/apiConst';

type Message = {
  id?: number;
  convId?: number;
  fromUser: number;
  toUser: number;
  time?: string;
  content: string;
  senderId?: number;
  receiverId?: number;
  senderUsername?: string;
  receiverUsername?: string;
};

type Role = 'user' | 'partner';

const ChatPage = () => {
  const { id, userId } = useLocalSearchParams<{ id: string; userId: string }>();
  const convId = id ? parseInt(id) : 0;
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const theme = useTheme();
  const { user, token } = useContext(AuthContext);
  const currentUserId = user?.id || 0;

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data: initialMessages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['chatHistory', convId],
    queryFn: async () => {
      const data = await getChatHistory(convId, 0, 1000);
      return data.map((message) => ({
        ...message,
        fromUser: message.fromUser || 0,
        toUser: message.toUser || 0,
        content: message.content || '',
      }));
    },
    enabled: !!convId,
    select: (data) =>
      data.sort(
        (a, b) =>
          new Date(a.time || 0).getTime() - new Date(b.time || 0).getTime(),
      ),
  });

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    if (!convId || !token) return;

    const socket = new SockJS(`${CHAT_WEB_SOCKET_BASE_URL}`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket connected');
      setIsConnected(true);

      // Subscribe to conversation topic
      client.subscribe(`/topic/${convId}`, (message) => {
        const receivedMessage: Message = JSON.parse(message.body);
        console.log('Received message:', receivedMessage);
        const isOurs = receivedMessage.senderId === currentUserId;
        if (!isOurs) {
          setMessages((prev) => [...prev, receivedMessage]);
        }
        // Scroll to bottom
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });
    };

    client.onStompError = (frame) => {
      console.error('WebSocket error:', frame.headers.message);
      setIsConnected(false);
    };

    client.onDisconnect = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    client.activate();
    setStompClient(client);

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [convId, token]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const getMessageRole = (message: Message): Role => {
    return message.fromUser === currentUserId ? 'user' : 'partner';
  };

  const handleSend = () => {
    if (!input.trim() || !stompClient || !isConnected || isSending) return;

    setIsSending(true);

    // Create message payload
    const message = {
      content: input,
      senderId: currentUserId,
      receiverId: userId
        ? parseInt(userId)
        : messages[0]?.fromUser === currentUserId
          ? messages[0]?.toUser
          : messages[0]?.fromUser,
      convId,
    };

    try {
      // Send message via WebSocket
      stompClient.publish({
        destination: `/app/chat/sendMessage/${convId}`,
        body: JSON.stringify(message),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Add message optimistically to UI
      const newMessage: Message = {
        ...message,
        time: new Date().toISOString(),
        fromUser: currentUserId,
        toUser: message.receiverId || 0,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput('');

      // Scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

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
          <ScrollView
            style={styles.chatContainer}
            ref={scrollRef}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message, index) => {
              const role = getMessageRole(message);
              return (
                <Card
                  key={`${message.id || index}_${message.time}`}
                  mode="contained"
                  style={[
                    styles.messageCard,
                    role === 'user'
                      ? styles.userMessage
                      : styles.partnerMessage,
                    {
                      backgroundColor:
                        role === 'user'
                          ? theme.colors.primaryContainer
                          : theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  <Card.Content>
                    <Text variant="bodyMedium">{message.content}</Text>
                    <View style={styles.messageFooter}>
                      <Text variant="labelSmall" style={styles.timestamp}>
                        {message.time
                          ? new Date(message.time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </Text>
                      {role === 'user' && (
                        <Text variant="labelSmall" style={styles.status}>
                          {message.id ? '✓✓' : '🕒'}
                        </Text>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              mode="outlined"
              placeholder="Message"
              value={input}
              onChangeText={setInput}
              style={styles.input}
              theme={{ roundness: 20 }}
              onSubmitEditing={handleSend}
              disabled={!isConnected || isSending}
            />
            <IconButton
              icon="send"
              mode="contained"
              size={24}
              onPress={handleSend}
              style={styles.sendButton}
              disabled={!input.trim() || !isConnected || isSending}
              loading={isSending}
            />
            {!isConnected && (
              <View style={styles.connectionStatus}>
                <Text style={styles.connectionText}>Connection</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  connectionStatus: {
    padding: 8,
    backgroundColor: '#ffeb3b',
    alignItems: 'center',
  },
  connectionText: {
    fontSize: 12,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  status: {
    opacity: 0.6,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  partnerMessage: {
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
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    opacity: 0.6,
    marginRight: 4,
  },
});

export default ChatPage;
