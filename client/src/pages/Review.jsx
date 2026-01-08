import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Review.css';

const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/reviews', {
        booking: bookingId,
        rating,
        comment: comment || undefined,
      });

      if (response.data.success) {
        navigate('/bookings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page">
      <div className="review-container">
        <h1>Rate Your Experience</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-section">
            <label>Rating</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="rating-text">{rating} out of 5 stars</p>
          </div>

          <div className="form-group">
            <label>Comment (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="6"
              placeholder="Share your experience..."
              maxLength={500}
            />
            <span className="char-count">{comment.length}/500</span>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Review;
