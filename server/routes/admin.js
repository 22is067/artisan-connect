const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Request = require('../models/Request');
const Resource = require('../models/Resource');

// Get all users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, verified, active } = req.query;
    let query = {};

    if (role) query.role = role;
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (active !== undefined) query.isActive = active === 'true';

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify/Unverify artisan
router.put('/users/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = req.body.isVerified;
    await user.save();

    res.json({ message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Activate/Deactivate user
router.put('/users/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = req.body.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get system statistics
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArtisans = await User.countDocuments({ role: 'artisan' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const verifiedArtisans = await User.countDocuments({ role: 'artisan', isVerified: true });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });
    const totalResources = await Resource.countDocuments({ isActive: true });

    // Recent activities
    const recentUsers = await User.find().select('name role createdAt').sort({ createdAt: -1 }).limit(5);
    const recentProducts = await Product.find().select('name artisan createdAt').populate('artisan', 'name').sort({ createdAt: -1 }).limit(5);
    const recentRequests = await Request.find().select('title status createdAt').sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalUsers,
        totalArtisans,
        totalBuyers,
        verifiedArtisans,
        totalProducts,
        totalRequests,
        pendingRequests,
        completedRequests,
        totalResources
      },
      recentActivities: {
        recentUsers,
        recentProducts,
        recentRequests
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all requests (admin view)
router.get('/requests', protect, authorize('admin'), async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('buyer', 'name email')
      .populate('artisan', 'name email')
      .populate('product', 'name category')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;