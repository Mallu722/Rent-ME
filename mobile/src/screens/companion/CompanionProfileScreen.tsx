import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { companionService } from '../../services/companion.service';
import { useAuth } from '../../context/AuthContext';

const CompanionProfileScreen = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    activityCategories: [] as string[],
    hourlyRate: '',
    availability: {
      days: [] as string[],
      timeSlots: [{ start: '09:00', end: '17:00' }],
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Load companion profile if exists
      // This would typically fetch the companion profile
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const activities = ['walking', 'party', 'travel', 'hangout', 'talk', 'sports', 'dining', 'shopping'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const toggleActivity = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      activityCategories: prev.activityCategories.includes(activity)
        ? prev.activityCategories.filter((a) => a !== activity)
        : [...prev.activityCategories, activity],
    }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter((d) => d !== day)
          : [...prev.availability.days, day],
      },
    }));
  };

  const handleSave = async () => {
    if (formData.activityCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one activity');
      return;
    }

    if (!formData.hourlyRate) {
      Alert.alert('Error', 'Please set your hourly rate');
      return;
    }

    setLoading(true);
    try {
      await companionService.createCompanionProfile({
        activityCategories: formData.activityCategories,
        pricing: {
          hourly: parseFloat(formData.hourlyRate),
          currency: 'USD',
        },
        availability: formData.availability,
      });

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Companion Profile</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Activity Categories</Text>
          <View style={styles.activitiesContainer}>
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity}
                style={[
                  styles.activityTag,
                  formData.activityCategories.includes(activity) && styles.activityTagActive,
                ]}
                onPress={() => toggleActivity(activity)}
              >
                <Text
                  style={[
                    styles.activityText,
                    formData.activityCategories.includes(activity) && styles.activityTextActive,
                  ]}
                >
                  {activity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Hourly Rate ($)</Text>
          <TextInput
            style={styles.input}
            value={formData.hourlyRate}
            onChangeText={(text) => setFormData({ ...formData, hourlyRate: text })}
            keyboardType="numeric"
            placeholder="Enter hourly rate"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Availability Days</Text>
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  formData.availability.days.includes(day) && styles.dayButtonActive,
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    formData.availability.days.includes(day) && styles.dayTextActive,
                  ]}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityTag: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  activityTagActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  activityText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  activityTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 15,
    minWidth: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dayButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  dayText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  dayTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CompanionProfileScreen;
