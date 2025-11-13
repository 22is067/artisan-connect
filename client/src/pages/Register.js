import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    phone: '',
    city: '',
    state: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country
        }
      };

      const user = await register(userData);

      // Redirect based on role
      if (user.role === 'artisan') {
        navigate('/artisan-dashboard');
      } else if (user.role === 'buyer') {
        navigate('/buyer-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join our community today</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label><FaUser /> Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FaLock /> Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter password"
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label><FaLock /> Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Register As</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="buyer">Buyer</option>
                <option value="artisan">Artisan</option>
              </select>
            </div>

            <div className="form-group">
              <label><FaPhone /> Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FaMapMarkerAlt /> City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="form-control"
                placeholder="Country"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;