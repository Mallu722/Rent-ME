import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { dummyCompanions } from '../data/dummyCompanions';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const Booking = () => {
  const { companionId, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [companion, setCompanion] = useState(null);
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    activity: '',
    date: '',
    startTime: '',
    endTime: '',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (companionId) {
      loadCompanion();
    }
    if (id) {
      loadBooking();
    }
  }, [companionId, id]);

  const loadCompanion = async () => {
    try {
      const response = await api.get(`/companions/${companionId}`);
      if (response.data.success) {
        setCompanion(response.data.data.companion);
        if (response.data.data.companion.activityCategories?.length > 0) {
          setFormData({ ...formData, activity: response.data.data.companion.activityCategories[0] });
        }
      }
    } catch (error) {
      console.error('Error loading companion:', error);
      // Fallback to dummy data
      const dummy = dummyCompanions.find(c => c._id === companionId);
      if (dummy) {
        setCompanion(dummy);
        if (dummy.activityCategories?.length > 0) {
          setFormData(prev => ({ ...prev, activity: dummy.activityCategories[0] }));
        }
      }
    }
  };

  const loadBooking = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      if (response.data.success) {
        setBooking(response.data.data.booking);
        const bookingData = response.data.data.booking;
        setFormData({
          activity: bookingData.activity,
          date: new Date(bookingData.date).toISOString().split('T')[0],
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          specialRequests: bookingData.specialRequests || '',
        });
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    }
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    let diff = (end - start) / (1000 * 60 * 60);
    if (diff < 0) diff += 24; // Handle overnight
    return diff;
  };

  const calculateTotal = () => {
    if (!companion) return 0;
    const duration = calculateDuration();
    const rate = companion.pricing?.activityBased?.[formData.activity] || companion.pricing?.hourly || 0;
    return rate * duration;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (id) {
        // Update existing booking
        await api.put(`/bookings/${id}/status`, { status: booking.status });
        navigate('/bookings');
      } else {
        // Create new booking
        const duration = calculateDuration();
        if (duration <= 0) {
          setError('End time must be after start time');
          setLoading(false);
          return;
        }

        try {
          const response = await api.post('/bookings', {
            companion: companionId,
            activity: formData.activity,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            duration,
            specialRequests: formData.specialRequests || undefined,
          });

          if (response.data.success) {
            navigate(`/payment/${response.data.data.booking._id}`);
          }
        } catch (apiError) {
          console.error("Booking API Error:", apiError);
          setError(apiError.response?.data?.message || 'Failed to create booking');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      navigate('/bookings');
    } catch (error) {
      setError('Failed to update booking status');
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>{id ? 'Booking Details' : 'Create Booking'}</h1>

        {companion && (
          <div className="companion-summary">
            <h3>Companion: {companion.userId?.name}</h3>
          </div>
        )}

        {booking && (
          <div className="booking-status">
            <span className={`status-badge status-${booking.status}`}>
              {booking.status.toUpperCase()}
            </span>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          {companion && (
            <div className="form-group">
              <label>Activity</label>
              <div className="activity-buttons">
                {companion.activityCategories?.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    className={`activity-btn ${formData.activity === activity ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, activity })}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              rows="4"
              placeholder="Any special requests or notes..."
            />
          </div>

          {companion && (
            <div className="total-section">
              <div className="total-row">
                <span>Duration:</span>
                <span>{calculateDuration().toFixed(1)} hours</span>
              </div>
              <div className="total-row">
                <span>Rate:</span>
                <span>₹{companion.pricing?.hourly}/hour</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          {!id && (
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          )}

          {id && booking && booking.status === 'pending' && user?.role === 'companion' && (
            <div className="action-buttons">
              <button
                type="button"
                className="confirm-button"
                onClick={() => handleStatusUpdate('confirmed')}
              >
                Confirm
              </button>
              <button
                type="button"
                className="reject-button"
                onClick={() => handleStatusUpdate('rejected')}
              >
                Reject
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Booking;
