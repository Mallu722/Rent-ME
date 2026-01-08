import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './CompanionProfile.css';

const CompanionProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    activityCategories: [],
    hourlyRate: '',
    availability: {
      days: [],
      timeSlots: [{ start: '09:00', end: '17:00' }],
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activities = ['walking', 'party', 'travel', 'hangout', 'talk', 'sports', 'dining', 'shopping'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const toggleActivity = (activity) => {
    setFormData((prev) => ({
      ...prev,
      activityCategories: prev.activityCategories.includes(activity)
        ? prev.activityCategories.filter((a) => a !== activity)
        : [...prev.activityCategories, activity],
    }));
  };

  const toggleDay = (day) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.activityCategories.length === 0) {
      setError('Please select at least one activity');
      return;
    }

    if (!formData.hourlyRate) {
      setError('Please set your hourly rate');
      return;
    }

    setLoading(true);
    try {
      await api.post('/companions', {
        activityCategories: formData.activityCategories,
        pricing: {
          hourly: parseFloat(formData.hourlyRate),
          currency: 'USD',
        },
        availability: formData.availability,
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="companion-profile-page">
      <div className="companion-profile-container">
        <h1>Companion Profile</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="companion-form">
          <div className="form-section">
            <label>Activity Categories</label>
            <div className="activities-grid">
              {activities.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  className={`activity-chip ${formData.activityCategories.includes(activity) ? 'active' : ''}`}
                  onClick={() => toggleActivity(activity)}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Hourly Rate ($)</label>
            <input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              placeholder="Enter hourly rate"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-section">
            <label>Availability Days</label>
            <div className="days-grid">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`day-button ${formData.availability.days.includes(day) ? 'active' : ''}`}
                  onClick={() => toggleDay(day)}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanionProfile;
