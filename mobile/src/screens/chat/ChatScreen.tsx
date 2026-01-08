import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSocket } from '../../context/SocketContext';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

type ChatRouteProp = RouteProp<{ params: { userId: string } }, 'params'>;

const ChatScreen = () => {
  const route = useRoute<ChatRouteProp>();
  const { userId } = route.params;
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();

    if (socket) {
      socket.on('new_message', (message: any) => {
        if (
          (message.sender._id === userId && message.receiver._id === user?._id) ||
          (message.receiver._id === userId && message.sender._id === user?._id)
        ) {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        }
      });

      socket.on('typing', (data: any) => {
        // Handle typing indicator
      });
    }

    return () => {
      if (socket) {
        socket.off('new_message');
        socket.off('typing');
      }
    };
  }, [socket, userId]);

  const loadMessages = async () => {
    try {
      const response = await api.get(`/chat/${userId}`);
      if (response.data.success) {
        setMessages(response.data.data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !socket) return;

    socket.emit('send_message', {
      receiverId: userId,
      content: messageText.trim(),
    });

    setMessageText('');
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.sender._id === user?._id;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString().slice(0, 5)}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!messageText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChatScreen;
