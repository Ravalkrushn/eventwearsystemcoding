const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

// @desc    Get all active vendors
// @route   GET /api/vendors
// @access  Public
exports.getPublicVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({ isApproved: true }).select('-password');
    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendors by category (vendors who have products in this category)
// @route   GET /api/vendors/category/:categoryName
// @access  Public
exports.getVendorsByCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.params;
    
    // Find unique vendor IDs who have approved products in this category
    const products = await Product.find({ 
        category: { $regex: categoryName, $options: 'i' },
        status: 'approved' 
    }).distinct('vendor');

    if (!products || products.length === 0) {
        return res.status(200).json({
            success: true,
            count: 0,
            data: []
        });
    }

    const vendors = await Vendor.find({ 
        _id: { $in: products },
        isApproved: true 
    }).select('-password');

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};
