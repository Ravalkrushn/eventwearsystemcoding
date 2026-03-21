const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getVendorProducts, deleteProduct, updateProduct, getProduct } = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');

// Public route to get approved products
router.get('/', getProducts);

// Route to get single product
router.get('/:id', getProduct);

// Route to add product (supports up to 4 images)
router.post('/', upload.array('images', 4), addProduct);

// Route to update product
router.put('/:id', upload.array('images', 4), updateProduct);

// Route to get products for a specific vendor
router.get('/vendor/:vendorId', getVendorProducts);

// Route to delete product
router.delete('/:id', deleteProduct);

module.exports = router;
