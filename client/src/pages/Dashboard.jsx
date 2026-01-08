import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';
import heroImage from '../assets/hero-creative.png';

const Dashboard = () => {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCompanions();
  }, []);

  const loadCompanions = async () => {
    try {
      const response = await api.get('/companions', {
        params: { limit: 12, search: searchQuery || undefined },
      });
      if (response.data.success) {
        setCompanions(response.data.data.companions);
      }
    } catch (error) {
      console.error('Error loading companions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadCompanions();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="hero-wrapper">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your <span className="highlight">Vibe</span>
          </h1>
          <p className="hero-subtitle">
            Connect with amazing people for genuine moments and unforgettable memories.
          </p>
          
          <form onSubmit={handleSearch} className="creative-search-form">
            <div className="search-glass">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, vibe, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="creative-search-input"
              />
              <button type="submit" className="creative-search-btn">Discover</button>
            </div>
          </form>
        </div>
        <div className="hero-image-container">
          <img src={heroImage} alt="Young friends hanging out" className="hero-creative-img" />
          <div className="hero-overlay"></div>
        </div>
      </div>

      <div className="section-header">
        <h2>Trending Companions</h2>
        <p>Meet the most popular people in your area</p>
      </div>

      <div className="creative-grid">
        {companions.length === 0 ? (
          <div className="no-results">
            <p>No companions found matching your vibe yet.</p>
          </div>
        ) : (
          companions.map((companion) => (
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
                
                <p className="card-location">📍 {companion.userId?.location?.city || 'Worldwide'}</p>
                
                <div className="card-tags">
                  {companion.activityCategories?.slice(0, 3).map((activity, idx) => (
                    <span key={idx} className="glass-tag">{activity}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

