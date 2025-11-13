import React, { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaEnvelope, FaCheckCircle, FaBan } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId, isVerified) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, { isVerified });
      toast.success(`User ${isVerified ? 'verified' : 'unverified'} successfully`);
      fetchAdminData();
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to update verification status');
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchAdminData();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>System Overview and Management</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#2196F3' }}>
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{stats?.stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#4CAF50' }}>
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{stats?.stats.totalArtisans}</h3>
              <p>Artisans</p>
              <small>{stats?.stats.verifiedArtisans} verified</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#FF9800' }}>
              <FaBox />
            </div>
            <div className="stat-info">
              <h3>{stats?.stats.totalProducts}</h3>
              <p>Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#9C27B0' }}>
              <FaEnvelope />
            </div>
            <div className="stat-info">
              <h3>{stats?.stats.totalRequests}</h3>
              <p>Requests</p>
              <small>{stats?.stats.pendingRequests} pending</small>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={selectedTab === 'overview' ? 'active' : ''}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button
            className={selectedTab === 'users' ? 'active' : ''}
            onClick={() => setSelectedTab('users')}
          >
            Users Management
          </button>
          <button
            className={selectedTab === 'artisans' ? 'active' : ''}
            onClick={() => setSelectedTab('artisans')}
          >
            Artisan Verification
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="tab-content">
            <div className="dashboard-section">
              <h2>Recent Activities</h2>
              <div className="activity-grid">
                <div className="activity-section">
                  <h3>Recent Users</h3>
                  <ul className="activity-list">
                    {stats?.recentActivities.recentUsers.map(user => (
                      <li key={user._id}>
                        <strong>{user.name}</strong>
                        <span className="badge badge-info">{user.role}</span>
                        <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="activity-section">
                  <h3>Recent Products</h3>
                  <ul className="activity-list">
                    {stats?.recentActivities.recentProducts.map(product => (
                      <li key={product._id}>
                        <strong>{product.name}</strong>
                        <small>by {product.artisan?.name}</small>
                        <small>{new Date(product.createdAt).toLocaleDateString()}</small>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="activity-section">
                  <h3>Recent Requests</h3>
                  <ul className="activity-list">
                    {stats?.recentActivities.recentRequests.map(request => (
                      <li key={request._id}>
                        <strong>{request.title}</strong>
                        <span className={`badge badge-${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <small>{new Date(request.createdAt).toLocaleDateString()}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="tab-content">
            <div className="dashboard-section">
              <h2>All Users ({users.length})</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Verified</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className="badge badge-info">{user.role}</span>
                        </td>
                        <td>
                          <span className={`badge badge-${user.isActive ? 'success' : 'danger'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {user.role === 'artisan' && (
                            <span className={`badge badge-${user.isVerified ? 'success' : 'warning'}`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          )}
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            {user.role === 'artisan' && (
                              <button
                                onClick={() => handleVerifyUser(user._id, !user.isVerified)}
                                className="btn-small btn-success"
                                title={user.isVerified ? 'Unverify' : 'Verify'}
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleUserStatus(user._id, !user.isActive)}
                              className={`btn-small ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                              title={user.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <FaBan />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'artisans' && (
          <div className="tab-content">
            <div className="dashboard-section">
              <h2>Artisan Verification</h2>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Skills</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'artisan').map(artisan => (
                      <tr key={artisan._id}>
                        <td>{artisan.name}</td>
                        <td>{artisan.email}</td>
                        <td>
                          {artisan.skills?.slice(0, 2).map((skill, i) => (
                            <span key={i} className="skill-tag-small">{skill}</span>
                          ))}
                        </td>
                        <td>
                          {artisan.location?.city}, {artisan.location?.state}
                        </td>
                        <td>
                          <span className={`badge badge-${artisan.isVerified ? 'success' : 'warning'}`}>
                            {artisan.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td>{new Date(artisan.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleVerifyUser(artisan._id, !artisan.isVerified)}
                            className={`btn-small ${artisan.isVerified ? 'btn-warning' : 'btn-success'}`}
                          >
                            {artisan.isVerified ? 'Unverify' : 'Verify'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'accepted': return 'success';
    case 'rejected': return 'danger';
    case 'completed': return 'info';
    default: return 'secondary';
  }
};

export default AdminDashboard;