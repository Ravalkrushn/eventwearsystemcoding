const Vendor = require('../models/Vendor');
const Category = require('../models/Category');

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private (Admin)
exports.getVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle vendor status (Activate/Deactivate)
// @route   PATCH /api/admin/vendors/:id/toggle-status
// @access  Private (Admin)
exports.toggleVendorStatus = async (req, res, next) => {
  try {
    let vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // Toggle isActive field (we'll add this to schema)
    vendor.isApproved = !vendor.isApproved; // Using isApproved as the status for now as requested for activate/deactivate
    await vendor.save();

    res.status(200).json({
      success: true,
      message: `Vendor ${vendor.isApproved ? 'Activated' : 'Deactivated'} successfully`,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create vendor by Admin
// @route   POST /api/admin/vendors
// @access  Private (Admin)
exports.createVendorByAdmin = async (req, res, next) => {
  try {
    const {
      ownerName,
      shopName,
      email,
      phone,
      shopAddress,
      city,
      aadharNumber,
      panNumber,
      bankAccount,
      ifscCode,
      password
    } = req.body;

    // Check if vendor exists
    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) {
      return res.status(400).json({ success: false, message: 'Vendor already exists with this email' });
    }

    const vendor = await Vendor.create({
      ownerName,
      shopName,
      email,
      phone,
      shopAddress,
      city,
      aadharNumber,
      panNumber,
      bankAccount,
      ifscCode,
      password,
      isApproved: true, // Admin created vendors are approved by default
      shopImage: req.file ? `/uploads/vendors/${req.file.filename}` : null
    });

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// --- Category Management ---

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private (Admin)
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin)
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
