import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>About Artisan Platform</h3>
          <p>
            Connecting skilled local artisans with buyers worldwide. 
            Empowering traditional craftsmanship in the digital age.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/artisans">Find Artisans</Link></li>
            <li><Link to="/resources">Training Resources</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>For Artisans</h3>
          <ul>
            <li><Link to="/register">Create Profile</Link></li>
            <li><Link to="/resources">Learning Resources</Link></li>
            <li><Link to="/artisans">View Artisans</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
          <p className="contact-info">
            Email: support@artisanplatform.com<br />
            Phone: +1 (555) 123-4567
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2025 Artisan Platform. All rights reserved.</p>
          <p>Built with ❤️ for local artisans</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;