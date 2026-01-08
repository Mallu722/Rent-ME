import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
    loadWallet();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data.success) {
        setProfile(response.data.data.user);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadWallet = async () => {
    try {
      const response = await api.get('/payments/wallet');
      if (response.data.success) {
        setWallet(response.data.data.wallet);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={user?.profilePhoto || 'https://via.placeholder.com/150'}
            alt={user?.name}
            className="profile-avatar"
          />
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>

        {wallet && (
          <div className="wallet-card">
            <h3>Wallet Balance</h3>
            <div className="wallet-amount">${wallet.balance?.toFixed(2) || '0.00'}</div>
            <button className="topup-button">Top Up</button>
          </div>
        )}

        <div className="profile-actions">
          {user?.role === 'companion' && (
            <Link to="/companion-profile" className="action-button">
              Manage Companion Profile
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="action-button admin-button">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
