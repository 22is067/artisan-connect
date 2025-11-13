import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import api from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import './SearchArtisans.css';

const SearchArtisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    skill: '',
    location: '',
    verified: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.skill) params.append('skill', filters.skill);
      if (filters.location) params.append('location', filters.location);
      if (filters.verified) params.append('verified', 'true');

      const response = await api.get(`/artisans?${params.toString()}`);
      setArtisans(response.data);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArtisans();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      skill: '',
      location: '',
      verified: false
    });
  };

  return (
    <div className="search-artisans-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Artisans</h1>
          <p>Discover talented local artisans and their amazing work</p>
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
                placeholder="Search by name, skill, or description..."
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
                  <label>Skill/Craft</label>
                  <input
                    type="text"
                    name="skill"
                    value={filters.skill}
                    onChange={handleFilterChange}
                    placeholder="e.g., Pottery, Textiles"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City, State, or Country"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="verified"
                      checked={filters.verified}
                      onChange={handleFilterChange}
                    />
                    <span>Verified Artisans Only</span>
                  </label>
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
              {loading ? 'Loading...' : `${artisans.length} Artisan${artisans.length !== 1 ? 's' : ''} Found`}
            </h2>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : artisans.length > 0 ? (
            <div className="grid grid-3">
              {artisans.map((artisan) => (
                <ArtisanCard key={artisan._id} artisan={artisan} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaSearch />
              <h3>No Artisans Found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchArtisans;