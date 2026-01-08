import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Companions.css';

const Companions = () => {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    activity: '',
    city: '',
    minRating: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadCompanions();
  }, [filters]);

  const loadCompanions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.activity) params.activity = filters.activity;
      if (filters.city) params.city = filters.city;
      if (filters.minRating) params.minRating = parseFloat(filters.minRating);
      if (filters.minPrice) params.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);

      const response = await api.get('/companions', { params });
      if (response.data.success) {
        setCompanions(response.data.data.companions);
      }
    } catch (error) {
      console.error('Error loading companions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const activities = ['walking', 'party', 'travel', 'hangout', 'talk', 'sports', 'dining', 'shopping'];

  return (
    <div className="companions-page">
      <div className="page-header">
        <h1>Discover Companions</h1>
        <p>Find the perfect match for your vibe</p>
      </div>

      <div className="companions-layout">
        <div className="filters-sidebar">
          <h3>Refine Search</h3>
          <div className="filter-group">
            <label>Activity</label>
            <select name="activity" value={filters.activity} onChange={handleFilterChange} className="glass-input">
              <option value="">All Activities</option>
              {activities.map((activity) => (
                <option key={activity} value={activity}>
                  {activity.charAt(0).toUpperCase() + activity.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="e.g. New York"
              className="glass-input"
            />
          </div>

          <div className="filter-group">
            <label>Min Rating</label>
            <input
              type="number"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              placeholder="0.0"
              min="0"
              max="5"
              step="0.1"
              className="glass-input"
            />
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                className="glass-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                className="glass-input"
              />
            </div>
          </div>
        </div>

        <div className="companions-grid-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
            </div>
          ) : companions.length === 0 ? (
            <div className="no-results">
              <span className="search-icon-large">🔍</span>
              <h3>No companions found</h3>
              <p>Try adjusting your filters to find more people.</p>
            </div>
          ) : (
            <div className="creative-grid">
              {companions.map((companion) => (
                <div key={companion._id} className="creative-card">
                  <div className="card-image-wrapper">
                    <img
                      src={companion.userId?.profilePhoto || 'https://via.placeholder.com/400x500'}
                      alt={companion.userId?.name}
                      className="card-img"
                    />
                    <div className="card-overlay">
                      <Link to={`/companions/${companion._id}`} className="card-btn">
                        Connect
                      </Link>
                    </div>
                    {companion.verification?.idVerified && (
                      <span className="verified-pill">Verified</span>
                    )}
                    <div className="card-price-tag">
                      ${companion.pricing?.hourly}/hr
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <h3>{companion.userId?.name}</h3>
                      <div className="card-rating">
                        ⭐ {companion.rating?.average?.toFixed(1) || 'NEW'}
                      </div>
                    </div>

                    <p className="card-location">📍 {companion.userId?.location?.city || 'Location not set'}</p>

                    <div className="card-tags">
                      {companion.activityCategories?.slice(0, 3).map((activity, idx) => (
                        <span key={idx} className="glass-tag">{activity}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companions;
