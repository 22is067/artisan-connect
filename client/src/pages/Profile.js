import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    skills: [],
    bio: '',
    experience: 0
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || { city: '', state: '', country: '', zipCode: '' },
        skills: user.skills || [],
        bio: user.bio || '',
        experience: user.experience || 0
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-primary"
          >
            {isEditing ? <><FaSave /> Cancel</> : <><FaEdit /> Edit Profile</>}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2>{user?.name}</h2>
              <p className="role-badge">{user?.role}</p>
              {user?.role === 'artisan' && user?.isVerified && (
                <span className="verified-badge">✓ Verified</span>
              )}
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <FaEnvelope />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="stat-item">
                  <FaPhone />
                  <span>{user?.phone}</span>
                </div>
              )}
              {user?.location?.city && (
                <div className="stat-item">
                  <FaMapMarkerAlt />
                  <span>
                    {user?.location.city}, {user?.location.state}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-main">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                  <h3>Basic Information</h3>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email (Cannot be changed)</label>
                    <input
                      type="email"
                      value={formData.email}
                      className="form-control"
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Location</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        name="location.zipCode"
                        value={formData.location.zipCode}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {user?.role === 'artisan' && (
                  <>
                    <div className="form-section">
                      <h3>Professional Information</h3>

                      <div className="form-group">
                        <label>Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          className="form-control"
                          rows="4"
                          placeholder="Tell people about yourself and your craft..."
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label>Years of Experience</label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="form-control"
                          min="0"
                        />
                      </div>

                      <div className="form-group">
                        <label>Skills</label>
                        <div className="skills-input">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="form-control"
                            placeholder="Add a skill..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSkill();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="btn btn-secondary"
                          >
                            Add
                          </button>
                        </div>

                        <div className="skills-list-edit">
                          {formData.skills.map((skill, index) => (
                            <span key={index} className="skill-tag-edit">
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="remove-skill"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary btn-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-view">
                <div className="info-section">
                  <h3>Contact Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Email:</strong>
                      <span>{user?.email}</span>
                    </div>
                    <div className="info-item">
                      <strong>Phone:</strong>
                      <span>{user?.phone || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <strong>Location:</strong>
                      <span>
                        {user?.location?.city && user?.location?.state
                          ? `${user.location.city}, ${user.location.state}, ${user.location.country}`
                          : 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                {user?.role === 'artisan' && (
                  <>
                    {user?.bio && (
                      <div className="info-section">
                        <h3>About Me</h3>
                        <p className="bio-text">{user.bio}</p>
                      </div>
                    )}

                    {user?.experience > 0 && (
                      <div className="info-section">
                        <h3>Experience</h3>
                        <p>{user.experience} years</p>
                      </div>
                    )}

                    {user?.skills && user.skills.length > 0 && (
                      <div className="info-section">
                        <h3>Skills</h3>
                        <div className="skills-list-view">
                          {user.skills.map((skill, index) => (
                            <span key={index} className="skill-tag-view">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;