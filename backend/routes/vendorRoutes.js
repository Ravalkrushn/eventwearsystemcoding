const express = require('express');
const router = express.Router();
const { getPublicVendors, getVendorsByCategory, getVendorProfile, updateVendorProfile } = require('../controllers/vendorController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getPublicVendors);
router.get('/category/:categoryName', getVendorsByCategory);
router.get('/profile/:id', getVendorProfile);
router.put('/profile/:id', upload.single('shopImage'), updateVendorProfile);

module.exports = router;
