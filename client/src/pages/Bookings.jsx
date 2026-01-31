import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { dummyBookings } from '../data/dummyBookings';
import './Bookings.css';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'companion' ? '/bookings/companion-bookings' : '/bookings/my-bookings';
      const response = await api.get(endpoint, { params: { status: filter || undefined } });
      if (response.data.success && response.data.data.bookings.length > 0) {
        setBookings(response.data.data.bookings);
      } else {
        throw new Error("No data from API");
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9500',
      confirmed: '#34C759',
      completed: '#007AFF',
      cancelled: '#FF3B30',
      rejected: '#FF3B30',
    };
    return colors[status] || '#666';
  };

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>
      <div className="filters">
        <button className={filter === '' ? 'active' : ''} onClick={() => setFilter('')}>All</button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
        <button className={filter === 'confirmed' ? 'active' : ''} onClick={() => setFilter('confirmed')}>Confirmed</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">No bookings found</div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const otherUser = user?.role === 'companion' ? booking.user : booking.companion?.userId;
            return (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h3>{otherUser?.name || 'Unknown'}</h3>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(booking.status) }}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <p><strong>Activity:</strong> {booking.activity}</p>
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                  <p><strong>Total:</strong> ₹{booking.pricing?.total?.toFixed(2)}</p>
                </div>
                <Link to={`/bookings/${booking._id}`} className="view-button">View Details</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
