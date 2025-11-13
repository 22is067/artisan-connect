import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaCheckCircle } from 'react-icons/fa';
import './ArtisanCard.css';

const ArtisanCard = ({ artisan }) => {
  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="artisan-card">
      <div className="artisan-image">
        <img 
          src={artisan.profileImage ? `${API_URL}${artisan.profileImage}` : '/default-avatar.png'} 
          alt={artisan.name}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Artisan'; }}
        />
        {artisan.isVerified && (
          <span className="verified-badge" title="Verified Artisan">
            <FaCheckCircle />
          </span>
        )}
      </div>

      <div className="artisan-info">
        <h3>{artisan.name}</h3>
        
        {artisan.location && (
          <p className="location">
            <FaMapMarkerAlt /> {artisan.location.city}, {artisan.location.state}
          </p>
        )}

        {artisan.rating > 0 && (
          <div className="rating">
            <FaStar className="star-icon" />
            <span>{artisan.rating.toFixed(1)}</span>
            <span className="reviews">({artisan.totalReviews} reviews)</span>
          </div>
        )}

        <div className="skills">
          {artisan.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {artisan.skills?.length > 3 && (
            <span className="skill-tag more">+{artisan.skills.length - 3}</span>
          )}
        </div>

        {artisan.bio && (
          <p className="bio">{artisan.bio.substring(0, 100)}...</p>
        )}

        <Link to={`/artisan/${artisan._id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ArtisanCard;