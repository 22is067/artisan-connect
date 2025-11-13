const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getArtisanProducts
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/artisan/:artisanId', getArtisanProducts);
router.post('/', protect, authorize('artisan'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('artisan'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;