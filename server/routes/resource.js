const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Resource = require('../models/Resource');

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { category, type, level, search } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (type) query.type = type;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const resources = await Resource.find(query)
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('addedBy', 'name email');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment views
    resource.views += 1;
    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create resource (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      addedBy: req.user._id
    };

    const resource = await Resource.create(resourceData);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update resource (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete resource (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;