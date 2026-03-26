const express = require('express');
const router = express.Router();
const { getPublicVendors, getVendorsByCategory, getVendorProfile, updateVendorProfile, getVendorOrders } = require('../controllers/vendorController');
const { addOrUpdatePolicy, getVendorPolicies } = require('../controllers/policyController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getPublicVendors);
router.get('/category/:categoryName', getVendorsByCategory);
router.get('/profile/:id', getVendorProfile);
router.put('/profile/:id', upload.single('shopImage'), updateVendorProfile);
router.get('/orders/:id', getVendorOrders);

// Policy Routes
router.post('/policies', addOrUpdatePolicy);
router.get('/policies/:vendorId', getVendorPolicies);

module.exports = router;
