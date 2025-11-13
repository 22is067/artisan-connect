import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import './MyProducts.css';

const MyProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, productId: null });

  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/artisan/${user._id}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
      setDeleteModal({ show: false, productId: null });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
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
    <div className="my-products-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>My Products</h1>
            <p>Manage your product listings</p>
          </div>
          <Link to="/add-product" className="btn btn-primary">
            <FaPlus /> Add New Product
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card-manage">
                <div className="product-image-manage">
                  <img
                    src={`${API_URL}${product.images?.[0]?.url}`}
                    alt={product.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Product'; }}
                  />
                  <span className={`status-badge ${product.availability}`}>
                    {product.availability}
                  </span>
                </div>

                <div className="product-info-manage">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="price">${product.price?.amount}</p>

                  <div className="product-stats">
                    <span><FaEye /> {product.views || 0} views</span>
                  </div>

                  <div className="product-actions">
                    <Link to={`/product/${product._id}`} className="btn btn-secondary btn-sm">
                      <FaEye /> View
                    </Link>
                    <Link to={`/edit-product/${product._id}`} className="btn btn-primary btn-sm">
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ show: true, productId: product._id })}
                      className="btn btn-danger btn-sm"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaPlus />
            <h3>No Products Yet</h3>
            <p>Start by adding your first product or service</p>
            <Link to="/add-product" className="btn btn-primary btn-lg">
              Add Your First Product
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, productId: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => handleDelete(deleteModal.productId)}
                className="btn btn-danger"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModal({ show: false, productId: null })}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;