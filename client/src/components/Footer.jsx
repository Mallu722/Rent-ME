import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Saathi</h3>
                    <p>
                        Connect with amazing people for genuine moments and unforgettable memories.
                        Find your vibe today.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/companions">Find Companions</Link></li>
                        <li><Link to="/bookings">My Bookings</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Support</h3>
                    <ul className="footer-links">
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Guidelines</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Connect</h3>
                    <div className="social-links">
                        <a href="#" className="social-icon">📸</a>
                        <a href="#" className="social-icon">🐦</a>
                        <a href="#" className="social-icon">📘</a>
                        <a href="#" className="social-icon">💼</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Saathi. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
