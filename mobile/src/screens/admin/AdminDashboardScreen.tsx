import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import api from '../../config/api';

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading && !stats) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Admin Dashboard</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.totalUsers || 0}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.totalCompanions || 0}</Text>
            <Text style={styles.statLabel}>Companions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.totalBookings || 0}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.activeBookings || 0}</Text>
            <Text style={styles.statLabel}>Active Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.completedBookings || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${stats?.totalRevenue?.toFixed(2) || '0.00'}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Manage Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>View Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Payment History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
});

export default AdminDashboardScreen;
