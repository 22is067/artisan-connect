import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaSearch, FaUsers, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';
import './Dashboard.css';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    completedRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/requests');
      const requests = response.data;

      setStats({
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        acceptedRequests: requests.filter(r => r.status === 'accepted').length,
        completedRequests: requests.filter(r => r.status === 'completed').length
      });

      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Manage your commission requests and discover new artisans</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#2196F3' }}>
              <FaEnvelope />
            </div>
            <div className="stat-info">
              <h3>{stats.totalRequests}</h3>
              <p>Total Requests</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#FF9800' }}>
              <FaEnvelope />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingRequests}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#4CAF50' }}>
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.acceptedRequests}</h3>
              <p>Accepted</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#9C27B0' }}>
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{stats.completedRequests}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/artisans" className="action-card">
              <FaSearch />
              <h3>Find Artisans</h3>
              <p>Search for skilled artisans</p>
            </Link>
            <Link to="/my-requests" className="action-card">
              <FaEnvelope />
              <h3>My Requests</h3>
              <p>View all your requests</p>
            </Link>
            <Link to="/resources" className="action-card">
              <FaUsers />
              <h3>Resources</h3>
              <p>Browse training materials</p>
            </Link>
            <Link to="/profile" className="action-card">
              <FaCheckCircle />
              <h3>Edit Profile</h3>
              <p>Update your information</p>
            </Link>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Requests</h2>
            <Link to="/my-requests" className="view-all">View All →</Link>
          </div>
          {recentRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Artisan</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map(request => (
                    <tr key={request._id}>
                      <td>{request.title}</td>
                      <td>{request.artisan?.name}</td>
                      <td>
                        <span className="badge badge-info">{request.type}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to="/my-requests" className="btn-small">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FaEnvelope />
              <h3>No Requests Yet</h3>
              <p>Start by finding artisans and sending commission requests</p>
              <Link to="/artisans" className="btn btn-primary">Find Artisans</Link>
            </div>
          )}
        </div>
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

export default BuyerDashboard;