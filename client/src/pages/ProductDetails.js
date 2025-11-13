import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaTag, FaEye, FaCalendar, FaBox } from 'react-icons/fa';
import api from '../services/api';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
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

  if (!product) {
    return <div className="container mt-3">Product not found</div>;
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="product-content">
          {/* Image Gallery */}
          <div className="image-section">
            <div className="main-image">
              <img
                src={`${API_URL}${product.images?.[selectedImage]?.url || '/default-product.png'}`}
                alt={product.name}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Product'; }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={`${API_URL}${img.url}`}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Image'; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="info-section">
            <h1>{product.name}</h1>

            <div className="product-meta">
              <span className="category">
                <FaTag /> {product.category}
              </span>
              <span className="views">
                <FaEye /> {product.views} views
              </span>
              <span className={`availability ${product.availability}`}>
                <FaBox /> {product.availability?.replace('-', ' ')}
              </span>
            </div>

            <div className="price-section">
              <span className="price">${product.price?.amount || 0}</span>
              {product.price?.negotiable && (
                <span className="negotiable-badge">Negotiable</span>
              )}
            </div>

            <div className="description-section">
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>

            {product.specifications && (
              <div className="specifications">
                <h2>Specifications</h2>
                <ul>
                  {product.specifications.dimensions && (
                    <li><strong>Dimensions:</strong> {product.specifications.dimensions}</li>
                  )}
                  {product.specifications.weight && (
                    <li><strong>Weight:</strong> {product.specifications.weight}</li>
                  )}
                  {product.specifications.materials && product.specifications.materials.length > 0 && (
                    <li><strong>Materials:</strong> {product.specifications.materials.join(', ')}</li>
                  )}
                  {product.specifications.customizable !== undefined && (
                    <li><strong>Customizable:</strong> {product.specifications.customizable ? 'Yes' : 'No'}</li>
                  )}
                </ul>
              </div>
            )}

            {product.productionTime && (
              <div className="production-time">
                <FaCalendar /> <strong>Production Time:</strong> {product.productionTime}
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="tags-section">
                <h3>Tags</h3>
                <div className="tags">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Artisan Info */}
            {product.artisan && (
              <div className="artisan-card-mini">
                <h3>About the Artisan</h3>
                <div className="artisan-info">
                  <img
                    src={product.artisan.profileImage ? `${API_URL}${product.artisan.profileImage}` : 'https://via.placeholder.com/80'}
                    alt={product.artisan.name}
                  />
                  <div>
                    <h4>{product.artisan.name}</h4>
                    {product.artisan.location && (
                      <p>{product.artisan.location.city}, {product.artisan.location.state}</p>
                    )}
                    {product.artisan.rating > 0 && (
                      <p className="rating">⭐ {product.artisan.rating.toFixed(1)}</p>
                    )}
                    <Link to={`/artisan/${product.artisan._id}`} className="btn btn-primary">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;