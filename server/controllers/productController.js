const Product = require('../models/Product');

// Get all products (with filters)
exports.getProducts = async (req, res) => {
  try {
    const { category, artisan, search, minPrice, maxPrice } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (artisan) query.artisan = artisan;
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = Number(minPrice);
      if (maxPrice) query['price.amount'].$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .populate('artisan', 'name email location skills profileImage')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('artisan', 'name email phone location skills bio profileImage rating');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product (Artisan only)
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      artisan: req.user._id
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        caption: ''
      }));
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.artisan.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get products by artisan
exports.getArtisanProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      artisan: req.params.artisanId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};