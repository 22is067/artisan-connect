const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Request = require('../models/Request');

// Get all requests for current user
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'buyer') {
      query.buyer = req.user._id;
    } else if (req.user.role === 'artisan') {
      query.artisan = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admin can see all requests
      query = {};
    }

    const requests = await Request.find(query)
      .populate('buyer', 'name email phone')
      .populate('artisan', 'name email phone skills')
      .populate('product', 'name category price images')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single request
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('buyer', 'name email phone location')
      .populate('artisan', 'name email phone location skills')
      .populate('product', 'name category price images description');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check authorization
    if (
      request.buyer.toString() !== req.user._id.toString() &&
      request.artisan.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new request
router.post('/', protect, async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      buyer: req.user._id
    };

    const request = await Request.create(requestData);
    
    const populatedRequest = await Request.findById(request._id)
      .populate('buyer', 'name email phone')
      .populate('artisan', 'name email phone skills')
      .populate('product', 'name category price images');

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update request status
router.put('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check authorization
    const isArtisan = request.artisan.toString() === req.user._id.toString();
    const isBuyer = request.buyer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isArtisan && !isBuyer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    if (req.body.status) request.status = req.body.status;
    if (req.body.quotation) request.quotation = req.body.quotation;
    if (req.body.message) {
      request.messages.push({
        sender: req.user._id,
        message: req.body.message
      });
    }

    await request.save();

    const updatedRequest = await Request.findById(request._id)
      .populate('buyer', 'name email phone')
      .populate('artisan', 'name email phone skills')
      .populate('product', 'name category price images');

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete request
router.delete('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only buyer or admin can delete
    if (request.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await request.deleteOne();
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;