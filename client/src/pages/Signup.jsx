import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/');
    } catch (err) {
      // Handle different error formats
      const errorMessage = err?.message || err?.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Saathi today</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            {error.includes('Cannot connect to server') && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                <strong>Quick Fix:</strong>
                <ol style={{ marginTop: '5px', paddingLeft: '20px' }}>
                  <li>Make sure backend server is running</li>
                  <li>Run: <code>cd server && npm run dev</code></li>
                  <li>Check if MongoDB is running</li>
                </ol>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label>I want to</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-button ${formData.role === 'user' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'user' })}
              >
                Find Companions
              </button>
              <button
                type="button"
                className={`role-button ${formData.role === 'companion' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'companion' })}
              >
                Be a Companion
              </button>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
