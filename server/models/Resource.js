const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Business Skills', 'Craft Techniques', 'Marketing', 'Digital Literacy', 'Legal & Finance', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['video', 'pdf', 'article', 'external-link', 'course']
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: String // e.g., "15 min", "2 hours"
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);