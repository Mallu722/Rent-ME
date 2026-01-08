import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../config/api';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      if (response.data.success) {
        setConversations(response.data.data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: any }) => {
    const otherUser = item.user;
    const lastMessage = item.lastMessage;

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => navigation.navigate('Chat' as never, { userId: otherUser._id } as never)}
      >
        <Image
          source={{ uri: otherUser?.profilePhoto || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View style={styles.conversationInfo}>
          <Text style={styles.name}>{otherUser?.name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage?.content || 'No messages'}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  list: {
    padding: 15,
  },
  conversationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChatListScreen;
