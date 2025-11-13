const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Get all artisans (with search and filters)
router.get('/', async (req, res) => {
  try {
    const { skill, location, search, verified } = req.query;
    let query = { role: 'artisan', isActive: true };

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (location) {
      query.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
        { 'location.country': new RegExp(location, 'i') }
      ];
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { skills: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') }
      ];
    }

    if (verified === 'true') {
      query.isVerified = true;
    }

    const artisans = await User.find(query)
      .select('-password')
      .sort({ isVerified: -1, rating: -1, createdAt: -1 });

    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get artisan by ID
router.get('/:id', async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id).select('-password');

    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update artisan profile
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const artisan = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;