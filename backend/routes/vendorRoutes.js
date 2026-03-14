const express = require('express');
const router = express.Router();
const { getPublicVendors, getVendorsByCategory } = require('../controllers/vendorController');

router.get('/', getPublicVendors);
router.get('/category/:categoryName', getVendorsByCategory);

module.exports = router;
