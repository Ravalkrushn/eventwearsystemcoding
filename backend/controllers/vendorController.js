const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const path = require('path');
const fs = require('fs');

// @desc    Get orders for a specific vendor
// @route   GET /api/vendors/orders/:id
// @access  Public (in real app, should be protected)
exports.getVendorOrders = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find orders where at least one item is from this vendor
    const orders = await Order.find({ 
        'items.vendor': id
    })
        .populate('user', 'fullName email phone')
        .populate('items.deliveryBoy', 'name phone email')
        .sort({ createdAt: -1 });

    // Filter items in each order to only include items belonging to this vendor
    const vendorOrders = orders.map(order => {
        const orderObj = order.toObject();
        orderObj.items = orderObj.items.filter(item => item.vendor.toString() === id);
        return orderObj;
    });

    res.status(200).json({
      success: true,
      count: vendorOrders.length,
      data: vendorOrders
    });
  } catch (error) {
    next(error);
  }
};

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

// @desc    Get specific vendor profile
// @route   GET /api/vendors/profile/:id
// @access  Public (should be protected in real app)
exports.getVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password');
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor profile (including shop image)
// @route   PUT /api/vendors/profile/:id
// @access  Public (should be protected)
exports.updateVendorProfile = async (req, res, next) => {
  try {
    let vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const updateData = { ...req.body };

    // Handle shop image upload
    if (req.file) {
      updateData.shopImage = `/uploads/vendors/${req.file.filename}`;
    }

    vendor = await Vendor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};
