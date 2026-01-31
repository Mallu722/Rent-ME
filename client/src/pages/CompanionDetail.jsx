import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { dummyCompanions } from '../data/dummyCompanions';
import './CompanionDetail.css';

const CompanionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companion, setCompanion] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanion();
    loadReviews();
  }, [id]);

  const loadCompanion = async () => {
    try {
      const response = await api.get(`/companions/${id}`);
      if (response.data.success) {
        setCompanion(response.data.data.companion);
      }
    } catch (error) {
      console.error('Error loading companion:', error);
      // Fallback to dummy data
      const dummy = dummyCompanions.find(c => c._id === id);
      if (dummy) {
        setCompanion(dummy);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await api.get(`/reviews/companion/${id}`);
      if (response.data.success) {
        setReviews(response.data.data.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!companion) {
    return <div className="error-container">Companion not found</div>;
  }

  const user = companion.userId;

  return (
    <div className="companion-detail-page">
      <div className="companion-header">
        <img
          src={user?.profilePhoto || 'https://via.placeholder.com/400'}
          alt={user?.name}
          className="companion-photo"
        />
        <div className="companion-info">
          <h1>{user?.name}</h1>
          <div className="rating-large">
            ⭐ {companion.rating?.average?.toFixed(1) || '0.0'} ({companion.rating?.count || 0} reviews)
          </div>
          <p className="location">📍 {user?.location?.city || 'Location not set'}</p>
          <div className="price-large">₹{companion.pricing?.hourly}/hour</div>
          <Link to={`/book/${id}`} className="book-button">
            Book Now
          </Link>
        </div>
      </div>

      <div className="companion-content">
        <div className="section">
          <h2>About</h2>
          <p>{user?.bio || 'No bio available'}</p>
        </div>

        <div className="section">
          <h2>Activities</h2>
          <div className="activities-grid">
            {companion.activityCategories?.map((activity, idx) => (
              <span key={idx} className="activity-badge">{activity}</span>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.user?.name}</span>
                    <span className="review-rating">⭐ {review.rating}/5</span>
                  </div>
                  <p className="review-comment">{review.comment || 'No comment'}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanionDetail;
