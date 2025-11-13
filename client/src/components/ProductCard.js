import React from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaEye } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const imageUrl = product.images?.[0]?.url || '/default-product.png';

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={`${API_URL}${imageUrl}`}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Product'; }}
        />
        <span className={`availability-badge ${product.availability}`}>
          {product.availability?.replace('-', ' ')}
        </span>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        
        <div className="product-meta">
          <span className="category">
            <FaTag /> {product.category}
          </span>
          <span className="views">
            <FaEye /> {product.views || 0}
          </span>
        </div>

        <p className="description">
          {product.description?.substring(0, 100)}...
        </p>

        <div className="product-footer">
          <div className="price">
            <span className="amount">${product.price?.amount || 0}</span>
            {product.price?.negotiable && (
              <span className="negotiable">Negotiable</span>
            )}
          </div>

          <Link to={`/product/${product._id}`} className="btn btn-secondary">
            View Details
          </Link>
        </div>

        {product.artisan && (
          <div className="artisan-info-small">
            By: <Link to={`/artisan/${product.artisan._id}`}>{product.artisan.name}</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;