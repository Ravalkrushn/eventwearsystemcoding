const express = require('express');
const router = express.Router();
const { 
  getVendors, 
  toggleVendorStatus, 
  createVendorByAdmin,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');
const upload = require('../middleware/uploadMiddleware');

// Vendor Management
router.get('/vendors', getVendors);
router.post('/vendors', upload.single('shopImage'), createVendorByAdmin);
router.patch('/vendors/:id/toggle-status', toggleVendorStatus);

// Category Management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
