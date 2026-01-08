import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{stats?.totalUsers || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Companions</h3>
          <div className="stat-value">{stats?.totalCompanions || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <div className="stat-value">{stats?.totalBookings || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <div className="stat-value">{stats?.activeBookings || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-value">{stats?.completedBookings || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <div className="stat-value">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
