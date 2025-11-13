import React, { useState, useEffect } from 'react';
import { FaBook, FaVideo, FaFilePdf, FaLink, FaSearch, FaFilter } from 'react-icons/fa';
import api from '../services/api';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    level: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Business Skills', 'Craft Techniques', 'Marketing', 'Digital Literacy', 'Legal & Finance', 'Other'];
  const types = ['video', 'pdf', 'article', 'external-link', 'course'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.level) params.append('level', filters.level);

      const response = await api.get(`/resources?${params.toString()}`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', type: '', level: '' });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <FaVideo />;
      case 'pdf': return <FaFilePdf />;
      case 'article': return <FaBook />;
      case 'external-link': return <FaLink />;
      default: return <FaBook />;
    }
  };

  return (
    <div className="resources-page">
      <div className="container">
        <div className="page-header">
          <h1>Training Resources</h1>
          <p>Learn new skills and grow your artisan business</p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search resources..."
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filters
              </button>
            </div>
          </form>

          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="form-control"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="form-control"
                  >
                    <option value="">All Types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Level</label>
                  <select
                    name="level"
                    value={filters.level}
                    onChange={handleFilterChange}
                    className="form-control"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-actions">
                <button onClick={handleSearch} className="btn btn-primary">
                  Apply Filters
                </button>
                <button onClick={clearFilters} className="btn btn-secondary">
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="results-section">
          <div className="results-header">
            <h2>
              {loading ? 'Loading...' : `${resources.length} Resource${resources.length !== 1 ? 's' : ''} Found`}
            </h2>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : resources.length > 0 ? (
            <div className="resources-grid">
              {resources.map((resource) => (
                <div key={resource._id} className="resource-card">
                  <div className="resource-header">
                    <div className="resource-type-icon">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="resource-meta">
                      <span className="badge badge-info">{resource.type}</span>
                      <span className={`badge badge-${resource.level === 'beginner' ? 'success' : resource.level === 'intermediate' ? 'warning' : 'danger'}`}>
                        {resource.level}
                      </span>
                    </div>
                  </div>

                  <div className="resource-content">
                    <h3>{resource.title}</h3>
                    <p className="category">{resource.category}</p>
                    <p className="description">{resource.description}</p>

                    {resource.author && (
                      <p className="author">By: {resource.author}</p>
                    )}

                    {resource.duration && (
                      <p className="duration">Duration: {resource.duration}</p>
                    )}

                    <div className="resource-tags">
                      {resource.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-block"
                    >
                      Access Resource
                    </a>
                  </div>

                  <div className="resource-footer">
                    <span className="views">👁 {resource.views || 0} views</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaBook />
              <h3>No Resources Found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;