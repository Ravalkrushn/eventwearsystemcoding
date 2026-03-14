const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Helper to generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user (Customer, Vendor, or Admin)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      role,
      email,
      password,
      // Customer fields
      fullName,
      phone,
      address,
      city,
      // Vendor specifically
      ownerName,
      shopName,
      shopAddress,
      aadharNumber,
      panNumber,
      bankAccount,
      ifscCode
    } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    let user;
    let Model;

    if (role === 'customer') Model = Customer;
    else if (role === 'vendor') Model = Vendor;
    else if (role === 'admin') Model = Admin;
    else return res.status(400).json({ success: false, message: 'Invalid role' });

    // Check if user exists
    const userExists = await Model.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user based on role
    if (role === 'customer') {
      user = await Customer.create({ fullName, email, password, phone, address, city });
    } else if (role === 'vendor') {
      user = await Vendor.create({
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
      });
    } else {
      user = await Admin.create({ fullName: fullName || ownerName, email, password });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.fullName || user.ownerName || user.shopName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);

    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Mongoose Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }

    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Attempt to find user in all models to auto-detect role
    let user = null;
    
    // Check Admin
    user = await Admin.findOne({ email }).select('+password');
    
    // Check Vendor if not found
    if (!user) {
      user = await Vendor.findOne({ email }).select('+password');
    }
    
    // Check Customer if still not found
    if (!user) {
      user = await Customer.findOne({ email }).select('+password');
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.fullName || user.ownerName || user.shopName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
