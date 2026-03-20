const express = require('express');
const router = express.Router();
const { 
  getVendors, 
  toggleVendorStatus, 
  createVendorByAdmin,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSizes,
  createSize,
  updateSize,
  deleteSize
} = require('../controllers/adminController');
const upload = require('../middleware/uploadMiddleware');

// Vendor Management
router.get('/vendors', getVendors);
router.post('/vendors', upload.single('shopImage'), createVendorByAdmin);
router.patch('/vendors/:id/toggle-status', toggleVendorStatus);

// Category Management
router.get('/categories', getCategories);
router.post('/categories', upload.single('image'), createCategory);
router.put('/categories/:id', upload.single('image'), updateCategory);
router.delete('/categories/:id', deleteCategory);

// Size Management
router.get('/sizes', getSizes);
router.post('/sizes', createSize);
router.put('/sizes/:id', updateSize);
router.delete('/sizes/:id', deleteSize);

module.exports = router;
