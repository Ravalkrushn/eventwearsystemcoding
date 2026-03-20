const Product = require('../models/Product');

// @desc    Add new product
// @route   POST /api/products
// @access  Private (Vendor)
exports.addProduct = async (req, res, next) => {
  try {
    const {
      productName,
      category,
      pricePerDay,
      deposit,
      size,
      color,
      material,
      description,
      vendorId // We will usually get this from auth middleware, but for now let's take it from body if auth is not fully ready
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);

    const product = await Product.create({
      vendor: vendorId, // Replace with req.user.id once auth is integrated
      productName,
      category,
      pricePerDay,
      deposit,
      size,
      color,
      material,
      description,
      images: imageUrls
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully and is pending approval',
      data: product
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error);
    next(error);
  }
};

// @desc    Get all products (with optional filters)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'approved' }).populate('vendor', 'shopName');
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor products
// @route   GET /api/products/vendor/:vendorId
// @access  Private (Vendor)
exports.getVendorProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ vendor: req.params.vendorId });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor/Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Optional: check if product belongs to user (req.user.id)
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
