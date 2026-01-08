import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { reviewService } from '../services/review.service';

type ReviewRouteProp = RouteProp<{ params: { bookingId: string } }, 'params'>;

const ReviewScreen = () => {
  const route = useRoute<ReviewRouteProp>();
  const navigation = useNavigation();
  const { bookingId } = route.params;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }

    setLoading(true);
    try {
      const response = await reviewService.createReview({
        booking: bookingId,
        rating,
        comment: comment || undefined,
      });

      if (response.success) {
        Alert.alert('Success', 'Review submitted successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Rate Your Experience</Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Rating</Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={40}
            startingValue={rating}
            onFinishRating={setRating}
            style={styles.rating}
          />
        </View>

        <View style={styles.commentContainer}>
          <Text style={styles.label}>Comment (Optional)</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience..."
            maxLength={500}
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Text>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  ratingContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  rating: {
    paddingVertical: 10,
  },
  commentContainer: {
    marginBottom: 30,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 15,
    minHeight: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  charCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ReviewScreen;
