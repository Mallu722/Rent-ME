import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { bookingService } from '../services/booking.service';
import { useAuth } from '../context/AuthContext';

const BookingsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | undefined>();

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response =
        user?.role === 'companion'
          ? await bookingService.getCompanionBookings(filter)
          : await bookingService.getMyBookings(filter);
      if (response.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'completed':
        return '#007AFF';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const renderBooking = ({ item }: { item: any }) => {
    const companion = item.companion?.userId || item.companion;
    const otherUser = user?.role === 'companion' ? item.user : companion;

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => navigation.navigate('BookingDetail' as never, { bookingId: item._id } as never)}
      >
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingName}>{otherUser?.name || 'Unknown'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.bookingActivity}>Activity: {item.activity}</Text>
        <Text style={styles.bookingDate}>
          {new Date(item.date).toLocaleDateString()} • {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.bookingTotal}>Total: ${item.pricing?.total?.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, !filter && styles.filterButtonActive]}
          onPress={() => setFilter(undefined)}
        >
          <Text style={[styles.filterText, !filter && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'confirmed' && styles.filterButtonActive]}
          onPress={() => setFilter('confirmed')}
        >
          <Text style={[styles.filterText, filter === 'confirmed' && styles.filterTextActive]}>
            Confirmed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  filters: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F9F9F9',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingActivity: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 5,
  },
  bookingDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  bookingTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 5,
  },
});

export default BookingsScreen;
