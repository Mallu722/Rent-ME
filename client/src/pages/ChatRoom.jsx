import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import './ChatRoom.css';

const ChatRoom = () => {
  const { userId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    loadUser();

    if (socket) {
      socket.on('new_message', (message) => {
        if (
          (message.sender._id === userId && message.receiver._id === user?._id) ||
          (message.receiver._id === userId && message.sender._id === user?._id)
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('new_message');
      }
    };
  }, [socket, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await api.get(`/chat/${userId}`);
      if (response.data.success) {
        setMessages(response.data.data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadUser = async () => {
    // Load other user info
  };

  const sendMessage = () => {
    if (!messageText.trim() || !socket) return;

    socket.emit('send_message', {
      receiverId: userId,
      content: messageText.trim(),
    });

    setMessageText('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <h2>Chat</h2>
      </div>
      <div className="messages-container">
        {messages.map((message) => {
          const isMyMessage = message.sender._id === user?._id;
          return (
            <div key={message._id} className={`message ${isMyMessage ? 'my-message' : 'other-message'}`}>
              <p>{message.content}</p>
              <span className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
