import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBox, FaEnvelope, FaEye, FaPlus, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../services/api';
import './Dashboard.css';

const ArtisanDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalViews: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, requestsRes] = await Promise.all([
        api.get(`/products/artisan/${user._id}`),
        api.get('/requests')
      ]);

      const products = productsRes.data;
      const requests = requestsRes.data;

      const totalViews = products.reduce((sum, product) => sum + (product.views || 0), 0);
      const pendingRequests = requests.filter(req => req.status === 'pending').length;

      setStats({
        totalProducts: products.length,
        totalRequests: requests.length,
        pendingRequests,
        totalViews
      });

      setRecentProducts(products.slice(0, 4));
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
            <p>Here's what's happening with your artisan profile</p>
          </div>
          {!user?.isVerified && (
            <div className="verification-alert">
              <FaExclamationCircle />
              <span>Your profile is pending verification</span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#4CAF50' }}>
              <FaBox />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

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
              <p>Pending Requests</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#9C27B0' }}>
              <FaEye />
            </div>
            <div className="stat-info">
              <h3>{stats.totalViews}</h3>
              <p>Total Views</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/add-product" className="action-card">
              <FaPlus />
              <h3>Add New Product</h3>
              <p>List a new product or service</p>
            </Link>
            <Link to="/my-products" className="action-card">
              <FaBox />
              <h3>Manage Products</h3>
              <p>View and edit your listings</p>
            </Link>
            <Link to="/my-requests" className="action-card">
              <FaEnvelope />
              <h3>View Requests</h3>
              <p>Check commission requests</p>
            </Link>
            <Link to="/profile" className="action-card">
              <FaCheckCircle />
              <h3>Edit Profile</h3>
              <p>Update your information</p>
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Products</h2>
            <Link to="/my-products" className="view-all">View All →</Link>
          </div>
          {recentProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={`${API_URL}${product.images?.[0]?.url}`}
                          alt={product.name}
                          className="table-image"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price?.amount}</td>
                      <td>{product.views || 0}</td>
                      <td>
                        <span className={`badge badge-${product.availability === 'in-stock' ? 'success' : 'warning'}`}>
                          {product.availability}
                        </span>
                      </td>
                      <td>
                        <Link to={`/product/${product._id}`} className="btn-small">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FaBox />
              <h3>No Products Yet</h3>
              <p>Start by adding your first product</p>
              <Link to="/add-product" className="btn btn-primary">Add Product</Link>
            </div>
          )}
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
                    <th>From</th>
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
                      <td>{request.buyer?.name}</td>
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
              <p>You'll see commission requests here</p>
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

export default ArtisanDashboard;