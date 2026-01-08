import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Chat.css';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Your Connections</h1>
        <p>Stay in touch with your favorite companions</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading messages...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>No conversations yet</h3>
          <p>Start a booking to chat with companions!</p>
          <Link to="/" className="start-btn">Browse Companions</Link>
        </div>
      ) : (
        <div className="messages-grid">
          {conversations.map((conv) => (
            <Link key={conv._id} to={`/chat/${conv._id}`} className="message-card">
              <div className="img-wrapper">
                <img
                  src={conv.user?.profilePhoto || 'https://via.placeholder.com/150'}
                  alt={conv.user?.name}
                  className="avatar-large"
                />
                {conv.user?.isOnline && <span className="online-indicator"></span>}
              </div>

              <div className="msg-content">
                <div className="msg-header">
                  <h3>{conv.user?.name}</h3>
                  <span className="msg-time">
                    {new Date(conv.lastMessage?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="msg-preview">
                  {conv.lastMessage?.content || 'No messages yet'}
                </p>

                {conv.unreadCount > 0 && (
                  <div className="msg-badge">{conv.unreadCount}</div>
                )}
              </div>

              <div className="hover-arrow">→</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat;
