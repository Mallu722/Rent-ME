import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { dummyCompanions } from '../data/dummyCompanions';
import './Dashboard.css';
import heroImage from '../assets/hero-creative.png';

const Dashboard = () => {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCompanions();
  }, [searchQuery]); // Reload when search query changes (debouncing would be better in prod but ok here)

  const loadCompanions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/companions', {
        params: { limit: 4, search: searchQuery || undefined },
      });
      if (response.data.success && response.data.data.companions.length > 0) {
        setCompanions(response.data.data.companions);
      } else {
        throw new Error("No data/API fail");
      }
    } catch (error) {
      // Fallback to dummy data
      let filtered = [...dummyCompanions];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(c =>
          c.userId.name.toLowerCase().includes(query) ||
          c.userId.location.city.toLowerCase().includes(query) ||
          c.activityCategories.some(act => act.toLowerCase().includes(query))
        );
      } else {
        // Trending: Top rated + Online status boost
        // Sort by rating (desc)
        filtered.sort((a, b) => b.rating.average - a.rating.average);
        // Take top 4-8 for trending
        filtered = filtered.slice(0, 8);
      }

      // Simulate delay
      setTimeout(() => {
        setCompanions(filtered);
        setLoading(false);
      }, 300);
      return;
    }
    setLoading(false);
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

      <div className="features-section">
        <div className="section-header">
          <h2>Why Choose Saathi?</h2>
          <p>Experience connection like never before</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000" alt="Community" />
            </div>
            <h3>Genuine Connections</h3>
            <p>Find people who share your interests and vibe. No fake profiles, just real people.</p>
          </div>

          <div className="feature-card">
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=2000" alt="Safety" />
            </div>
            <h3>Verified & Safe</h3>
            <p>Your safety is our priority. Every companion is verified for your peace of mind.</p>
          </div>

          <div className="feature-card">
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2000" alt="Experience" />
            </div>
            <h3>Unforgettable Experiences</h3>
            <p>Create memories that last a lifetime, whether it's a city tour or a coffee chat.</p>
          </div>

          <div className="feature-card">
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=2000" alt="Friendship" />
            </div>
            <h3>For Every Need</h3>
            <p>Study partner, local guide, or just a friend to talk to—find exactly who you're looking for.</p>
          </div>
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
                  ₹{companion.pricing?.hourly}/hr
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

