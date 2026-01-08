import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { companionService } from '../services/companion.service';
import { reviewService } from '../services/review.service';

type CompanionDetailRouteProp = RouteProp<{ params: { companionId: string } }, 'params'>;

const CompanionDetailScreen = () => {
  const route = useRoute<CompanionDetailRouteProp>();
  const navigation = useNavigation();
  const { companionId } = route.params;
  const [companion, setCompanion] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanion();
    loadReviews();
  }, []);

  const loadCompanion = async () => {
    try {
      const response = await companionService.getCompanionById(companionId);
      if (response.success) {
        setCompanion(response.data.companion);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load companion details');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewService.getCompanionReviews(companionId);
      if (response.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleBook = () => {
    navigation.navigate('Booking' as never, { companionId } as never);
  };

  if (loading || !companion) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const user = companion.userId;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: user?.profilePhoto || 'https://via.placeholder.com/300' }}
        style={styles.heroImage}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.rating}>
          ⭐ {companion.rating?.average?.toFixed(1) || '0.0'} ({companion.rating?.count || 0} reviews)
        </Text>
        <Text style={styles.location}>📍 {user?.location?.city || 'Location not set'}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{user?.bio || 'No bio available'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.activitiesContainer}>
            {companion.activityCategories?.map((activity: string, index: number) => (
              <View key={index} style={styles.activityTag}>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <Text style={styles.price}>${companion.pricing?.hourly}/hour</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet</Text>
          ) : (
            reviews.map((review) => (
              <View key={review._id} style={styles.reviewCard}>
                <Text style={styles.reviewRating}>⭐ {review.rating}/5</Text>
                <Text style={styles.reviewComment}>{review.comment || 'No comment'}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  rating: {
    fontSize: 18,
    color: '#FF9500',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  bio: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activityText: {
    color: '#007AFF',
    fontSize: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewRating: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#FF9500',
  },
  reviewComment: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  noReviews: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CompanionDetailScreen;
