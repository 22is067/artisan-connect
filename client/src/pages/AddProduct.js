import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaImage } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import './ProductForm.css';

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pottery',
    price: { amount: '', negotiable: false },
    availability: 'in-stock',
    productionTime: '',
    specifications: {
      dimensions: '',
      weight: '',
      materials: '',
      customizable: false
    },
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = [
    'Pottery', 'Textiles', 'Woodwork', 'Jewelry', 'Paintings',
    'Sculpture', 'Metalwork', 'Leather', 'Glass', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: type === 'checkbox' ? checked : value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      // Prepare product data
      const productData = {
        ...formData,
        specifications: {
          ...formData.specifications,
          materials: formData.specifications.materials.split(',').map(m => m.trim()).filter(m => m)
        },
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      // Append product data
      Object.keys(productData).forEach(key => {
        if (typeof productData[key] === 'object') {
          formDataToSend.append(key, JSON.stringify(productData[key]));
        } else {
          formDataToSend.append(key, productData[key]);
        }
      });

      await api.post('/products', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Product added successfully!');
      navigate('/my-products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page">
      <div className="container">
        <div className="page-header">
          <h1>Add New Product</h1>
          <p>List a new product or service</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="5"
                placeholder="Describe your product in detail..."
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Availability *</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="in-stock">In Stock</option>
                  <option value="made-to-order">Made to Order</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Pricing</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Price (USD) *</label>
                <input
                  type="number"
                  name="price.amount"
                  value={formData.price.amount}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="price.negotiable"
                    checked={formData.price.negotiable}
                    onChange={handleChange}
                  />
                  <span>Price is negotiable</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Product Images</h2>
            <div className="form-group">
              <label>Upload Images (Max 5)</label>
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input"
                  id="images"
                  max="5"
                />
                <label htmlFor="images" className="file-label">
                  <FaImage />
                  <span>Choose Images</span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Specifications</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Dimensions</label>
                <input
                  type="text"
                  name="specifications.dimensions"
                  value={formData.specifications.dimensions}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., 10cm x 15cm x 5cm"
                />
              </div>

              <div className="form-group">
                <label>Weight</label>
                <input
                  type="text"
                  name="specifications.weight"
                  value={formData.specifications.weight}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., 500g"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Materials (comma-separated)</label>
              <input
                type="text"
                name="specifications.materials"
                value={formData.specifications.materials}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Clay, Ceramic, Glaze"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Production Time</label>
                <input
                  type="text"
                  name="productionTime"
                  value={formData.productionTime}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., 2-3 weeks"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="specifications.customizable"
                    checked={formData.specifications.customizable}
                    onChange={handleChange}
                  />
                  <span>Product is customizable</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., handmade, traditional, modern"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-products')}
              className="btn btn-secondary btn-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;