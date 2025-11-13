import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUsers, FaBox, FaAward } from 'react-icons/fa';
import api from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  const fetchFeaturedData = async () => {
    try {
      const [artisansRes, productsRes] = await Promise.all([
        api.get('/artisans?verified=true'),
        api.get('/products')
      ]);

      setFeaturedArtisans(artisansRes.data.slice(0, 3));
      setFeaturedProducts(productsRes.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1>Connect with Skilled Local Artisans</h1>
            <p>Discover unique handcrafted products and connect with talented artisans in your area</p>
            <div className="hero-buttons">
              <Link to="/artisans" className="btn btn-primary btn-lg">
                <FaSearch /> Find Artisans
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Join as Artisan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Connect with Artisans</h3>
              <p>Find skilled artisans in your area with verified profiles and portfolios</p>
            </div>
            <div className="feature-card">
              <FaBox className="feature-icon" />
              <h3>Quality Products</h3>
              <p>Browse unique, handcrafted products made by talented local artisans</p>
            </div>
            <div className="feature-card">
              <FaAward className="feature-icon" />
              <h3>Verified Profiles</h3>
              <p>All artisans are verified to ensure quality and authenticity</p>
            </div>
            <div className="feature-card">
              <FaSearch className="feature-icon" />
              <h3>Easy Search</h3>
              <p>Filter by skill, location, and specialty to find the perfect artisan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="featured-artisans">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Artisans</h2>
            <Link to="/artisans" className="view-all">View All →</Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-3">
              {featuredArtisans.map(artisan => (
                <ArtisanCard key={artisan._id} artisan={artisan} />
              ))}
            </div>
          )}

          {!loading && featuredArtisans.length === 0 && (
            <p className="text-center">No featured artisans available yet.</p>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/artisans" className="view-all">View All →</Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-3">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <p className="text-center">No products available yet.</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join our community of talented artisans and passionate buyers</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;