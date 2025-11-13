import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaStar, FaCheckCircle, FaPhone, FaEnvelope, FaCalendar } from 'react-icons/fa';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import './ArtisanProfile.css';

const ArtisanProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    type: 'inquiry',
    title: '',
    description: '',
    budget: { min: '', max: '' },
    deadline: ''
  });

  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    fetchArtisanData();
  }, [id]);

  const fetchArtisanData = async () => {
    try {
      const [artisanRes, productsRes] = await Promise.all([
        api.get(`/artisans/${id}`),
        api.get(`/products/artisan/${id}`)
      ]);
      setArtisan(artisanRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching artisan data:', error);
      toast.error('Failed to load artisan profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRequestData({
        ...requestData,
        [parent]: { ...requestData[parent], [child]: value }
      });
    } else {
      setRequestData({ ...requestData, [name]: value });
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to send a request');
      navigate('/login');
      return;
    }

    try {
      await api.post('/requests', {
        ...requestData,
        artisan: id
      });
      toast.success('Request sent successfully!');
      setShowRequestModal(false);
      setRequestData({
        type: 'inquiry',
        title: '',
        description: '',
        budget: { min: '', max: '' },
        deadline: ''
      });
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!artisan) {
    return <div className="container mt-3">Artisan not found</div>;
  }

  return (
    <div className="artisan-profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-large">
            <img
              src={artisan.profileImage ? `${API_URL}${artisan.profileImage}` : 'https://via.placeholder.com/200'}
              alt={artisan.name}
            />
            {artisan.isVerified && (
              <span className="verified-badge-large">
                <FaCheckCircle /> Verified
              </span>
            )}
          </div>

          <div className="profile-info">
            <h1>{artisan.name}</h1>
            
            {artisan.location && (
              <p className="location">
                <FaMapMarkerAlt /> {artisan.location.city}, {artisan.location.state}, {artisan.location.country}
              </p>
            )}

            {artisan.rating > 0 && (
              <div className="rating">
                <FaStar className="star-icon" />
                <span>{artisan.rating.toFixed(1)}</span>
                <span className="reviews">({artisan.totalReviews} reviews)</span>
              </div>
            )}

            <div className="contact-info">
              {artisan.phone && (
                <p><FaPhone /> {artisan.phone}</p>
              )}
              {artisan.email && (
                <p><FaEnvelope /> {artisan.email}</p>
              )}
              {artisan.experience && (
                <p><FaCalendar /> {artisan.experience} years of experience</p>
              )}
            </div>

            {user && user._id !== artisan._id && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="btn btn-primary btn-lg"
              >
                Send Commission Request
              </button>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="card">
          <h2>Skills & Expertise</h2>
          <div className="skills-list">
            {artisan.skills?.map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>

        {/* Bio Section */}
        {artisan.bio && (
          <div className="card">
            <h2>About</h2>
            <p className="bio-text">{artisan.bio}</p>
          </div>
        )}

        {/* Portfolio Section */}
        {artisan.portfolio && artisan.portfolio.length > 0 && (
          <div className="card">
            <h2>Portfolio</h2>
            <div className="portfolio-grid">
              {artisan.portfolio.map((item, index) => (
                <div key={index} className="portfolio-item">
                  {item.image && (
                    <img src={`${API_URL}${item.image}`} alt={item.title} />
                  )}
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="products-section">
          <h2>Products & Services ({products.length})</h2>
          {products.length > 0 ? (
            <div className="grid grid-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center">No products available yet</p>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Commission Request</h2>
              <button className="modal-close" onClick={() => setShowRequestModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitRequest}>
              <div className="form-group">
                <label>Request Type</label>
                <select
                  name="type"
                  value={requestData.type}
                  onChange={handleRequestChange}
                  className="form-control"
                  required
                >
                  <option value="inquiry">General Inquiry</option>
                  <option value="commission">Commission Work</option>
                  <option value="quote">Request Quote</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={requestData.title}
                  onChange={handleRequestChange}
                  className="form-control"
                  placeholder="Brief title for your request"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={requestData.description}
                  onChange={handleRequestChange}
                  className="form-control"
                  rows="5"
                  placeholder="Describe your requirements in detail..."
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Budget Min ($)</label>
                  <input
                    type="number"
                    name="budget.min"
                    value={requestData.budget.min}
                    onChange={handleRequestChange}
                    className="form-control"
                    placeholder="Minimum budget"
                  />
                </div>
                <div className="form-group">
                  <label>Budget Max ($)</label>
                  <input
                    type="number"
                    name="budget.max"
                    value={requestData.budget.max}
                    onChange={handleRequestChange}
                    className="form-control"
                    placeholder="Maximum budget"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deadline (Optional)</label>
                <input
                  type="date"
                  name="deadline"
                  value={requestData.deadline}
                  onChange={handleRequestChange}
                  className="form-control"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Send Request
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanProfile;