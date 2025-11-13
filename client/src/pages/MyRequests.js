import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaCheckCircle, FaTimes, FaClock } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import './MyRequests.css';

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleUpdateStatus = async (requestId) => {
    if (!statusUpdate) {
      toast.error('Please select a status');
      return;
    }

    try {
      await api.put(`/requests/${requestId}`, {
        status: statusUpdate,
        message: message
      });
      toast.success('Request updated successfully');
      fetchRequests();
      setShowModal(false);
      setStatusUpdate('');
      setMessage('');
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'accepted':
        return <FaCheckCircle className="status-icon accepted" />;
      case 'rejected':
        return <FaTimes className="status-icon rejected" />;
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      default:
        return <FaEnvelope className="status-icon" />;
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
    <div className="my-requests-page">
      <div className="container">
        <div className="page-header">
          <h1>My Requests</h1>
          <p>Manage your commission requests</p>
        </div>

        {requests.length > 0 ? (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div>
                    <h3>{request.title}</h3>
                    <p className="request-type">
                      <span className="badge badge-info">{request.type}</span>
                    </p>
                  </div>
                  <div className="request-status">
                    {getStatusIcon(request.status)}
                    <span className={`status-text ${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                </div>

                <div className="request-body">
                  <p className="request-description">
                    {request.description.substring(0, 150)}...
                  </p>

                  <div className="request-meta">
                    {user.role === 'artisan' ? (
                      <p><strong>From:</strong> {request.buyer?.name}</p>
                    ) : (
                      <p><strong>To:</strong> {request.artisan?.name}</p>
                    )}
                    {request.budget?.min && (
                      <p>
                        <strong>Budget:</strong> ${request.budget.min} - ${request.budget.max}
                      </p>
                    )}
                    {request.deadline && (
                      <p>
                        <strong>Deadline:</strong>{' '}
                        {new Date(request.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="request-footer">
                    <span className="request-date">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaEnvelope />
            <h3>No Requests Yet</h3>
            <p>
              {user.role === 'artisan'
                ? "You'll see commission requests from buyers here"
                : 'Start by finding artisans and sending requests'}
            </p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRequest.title}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Request Details</h3>
                <p><strong>Type:</strong> <span className="badge badge-info">{selectedRequest.type}</span></p>
                <p><strong>Status:</strong> <span className={`badge badge-${getStatusColor(selectedRequest.status)}`}>{selectedRequest.status}</span></p>
                {user.role === 'artisan' && (
                  <p><strong>From:</strong> {selectedRequest.buyer?.name} ({selectedRequest.buyer?.email})</p>
                )}
                {user.role === 'buyer' && (
                  <p><strong>To:</strong> {selectedRequest.artisan?.name} ({selectedRequest.artisan?.email})</p>
                )}
                <p><strong>Created:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <p className="description-text">{selectedRequest.description}</p>
              </div>

              {selectedRequest.budget?.min && (
                <div className="detail-section">
                  <h3>Budget</h3>
                  <p>${selectedRequest.budget.min} - ${selectedRequest.budget.max} {selectedRequest.budget.currency}</p>
                </div>
              )}

              {selectedRequest.deadline && (
                <div className="detail-section">
                  <h3>Deadline</h3>
                  <p>{new Date(selectedRequest.deadline).toLocaleDateString()}</p>
                </div>
              )}

              {selectedRequest.messages && selectedRequest.messages.length > 0 && (
                <div className="detail-section">
                  <h3>Messages</h3>
                  <div className="messages-list">
                    {selectedRequest.messages.map((msg, index) => (
                      <div key={index} className="message-item">
                        <p className="message-text">{msg.message}</p>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {user.role === 'artisan' && selectedRequest.status === 'pending' && (
                <div className="detail-section">
                  <h3>Update Request</h3>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="form-control"
                    >
                      <option value="">Select Status</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Message (Optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-control"
                      rows="3"
                      placeholder="Add a message..."
                    ></textarea>
                  </div>
                  <button
                    onClick={() => handleUpdateStatus(selectedRequest._id)}
                    className="btn btn-primary"
                  >
                    Update Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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

export default MyRequests;