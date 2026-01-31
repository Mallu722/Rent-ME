import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Saathi Logo" className="logo-image" />
          Saathi
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/companions" className="nav-link">Companions</Link>
              <Link to="/bookings" className="nav-link">Bookings</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link signup-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
