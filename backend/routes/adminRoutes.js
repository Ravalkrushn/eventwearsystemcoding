const express = require('express');
const router = express.Router();
const { 
  getVendors, 
  toggleVendorStatus, 
  createVendorByAdmin 
} = require('../controllers/adminController');
const upload = require('../middleware/uploadMiddleware');

// All routes are for Admin only
router.get('/vendors', getVendors);
router.post('/vendors', upload.single('shopImage'), createVendorByAdmin);
router.patch('/vendors/:id/toggle-status', toggleVendorStatus);

module.exports = router;
