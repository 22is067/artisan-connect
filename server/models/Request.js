const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  type: {
    type: String,
    enum: ['commission', 'inquiry', 'quote'],
    default: 'inquiry'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  budget: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  attachments: [{
    filename: String,
    url: String
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  quotation: {
    amount: Number,
    currency: String,
    details: String,
    validUntil: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);