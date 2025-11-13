const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Pottery', 'Textiles', 'Woodwork', 'Jewelry', 'Paintings',
      'Sculpture', 'Metalwork', 'Leather', 'Glass', 'Other'
    ]
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  images: [{
    url: String,
    caption: String
  }],
  specifications: {
    dimensions: String,
    weight: String,
    materials: [String],
    customizable: Boolean
  },
  availability: {
    type: String,
    enum: ['in-stock', 'made-to-order', 'out-of-stock'],
    default: 'in-stock'
  },
  productionTime: {
    type: String, // e.g., "2-3 weeks"
    default: 'Immediate'
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);