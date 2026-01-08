import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { bookingService } from '../services/booking.service';
import { companionService } from '../services/companion.service';
import { useAuth } from '../context/AuthContext';

type BookingRouteProp = RouteProp<{ params: { companionId: string; bookingId?: string } }, 'params'>;

const BookingScreen = () => {
  const route = useRoute<BookingRouteProp>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { companionId, bookingId } = route.params || {};
  const [companion, setCompanion] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [activity, setActivity] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (companionId) {
      loadCompanion();
    }
    if (bookingId) {
      loadBooking();
    }
  }, []);

  const loadCompanion = async () => {
    try {
      const response = await companionService.getCompanionById(companionId!);
      if (response.success) {
        setCompanion(response.data.companion);
        if (response.data.companion.activityCategories?.length > 0) {
          setActivity(response.data.companion.activityCategories[0]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load companion');
    }
  };

  const loadBooking = async () => {
    try {
      const response = await bookingService.getBookingById(bookingId!);
      if (response.success) {
        setBooking(response.data.booking);
        setDate(new Date(response.data.booking.date));
        setActivity(response.data.booking.activity);
        setSpecialRequests(response.data.booking.specialRequests || '');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load booking');
    }
  };

  const calculateDuration = () => {
    const diff = endTime.getTime() - startTime.getTime();
    return diff / (1000 * 60 * 60); // Convert to hours
  };

  const calculateTotal = () => {
    if (!companion) return 0;
    const duration = calculateDuration();
    const rate = companion.pricing?.activityBased?.[activity] || companion.pricing?.hourly || 0;
    return rate * duration;
  };

  const handleCreateBooking = async () => {
    if (!activity || !companionId) {
      Alert.alert('Error', 'Please select an activity');
      return;
    }

    const duration = calculateDuration();
    if (duration <= 0) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      const response = await bookingService.createBooking({
        companion: companionId,
        activity,
        date: date.toISOString(),
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        duration,
        specialRequests: specialRequests || undefined,
      });

      if (response.success) {
        Alert.alert('Success', 'Booking created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Payment' as never, { bookingId: response.data.booking._id } as never),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!bookingId) return;

    try {
      await bookingService.updateBookingStatus(bookingId, status);
      Alert.alert('Success', `Booking ${status} successfully`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update booking');
    }
  };

  if (bookingId && !booking) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {companion && (
          <>
            <Text style={styles.title}>Book Companion</Text>
            <Text style={styles.companionName}>{companion.userId?.name}</Text>
          </>
        )}

        {booking && (
          <>
            <Text style={styles.title}>Booking Details</Text>
            <Text style={styles.status}>Status: {booking.status}</Text>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Activity</Text>
          {companion?.activityCategories?.map((act: string) => (
            <TouchableOpacity
              key={act}
              style={[styles.activityButton, activity === act && styles.activityButtonActive]}
              onPress={() => setActivity(act)}
            >
              <Text style={[styles.activityText, activity === act && styles.activityTextActive]}>
                {act}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text>{startTime.toLocaleTimeString().slice(0, 5)}</Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(false);
                if (selectedTime) setStartTime(selectedTime);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text>{endTime.toLocaleTimeString().slice(0, 5)}</Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(false);
                if (selectedTime) setEndTime(selectedTime);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Special Requests</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={specialRequests}
            onChangeText={setSpecialRequests}
            placeholder="Any special requests..."
          />
        </View>

        {companion && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
          </View>
        )}

        {!bookingId && companionId && (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateBooking}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating...' : 'Create Booking'}
            </Text>
          </TouchableOpacity>
        )}

        {booking && booking.status === 'pending' && user?.role === 'companion' && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => handleUpdateStatus('confirmed')}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleUpdateStatus('rejected')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  companionName: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  activityButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  activityButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  activityText: {
    color: '#8E8E93',
  },
  activityTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#F9F9F9',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
});

export default BookingScreen;
