const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const DeliveryBoy = require('../models/DeliveryBoy');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

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
    else if (role === 'delivery') Model = DeliveryBoy;
    else return res.status(400).json({ success: false, message: 'Invalid role' });

    // Check if user exists in ANY model (Global Uniqueness)
    const adminExists = await Admin.findOne({ email });
    const vendorExists = await Vendor.findOne({ email });
    const customerExists = await Customer.findOne({ email });
    const deliveryExists = await DeliveryBoy.findOne({ email });

    if (adminExists || vendorExists || customerExists || deliveryExists) {
      return res.status(400).json({ success: false, message: 'This email is already registered. Please use a different one.' });
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
        password,
        shopImage: req.file ? `/uploads/vendors/${req.file.filename}` : null
      });
    } else {
      user = await Admin.create({ fullName: fullName || ownerName, email, password });
    }

    // --- Send Welcome Email to Vendor ---
    if (role === 'vendor') {
      try {
        await sendEmail({
          email: user.email,
          subject: 'Welcome to EventWear Rental Hub - Registration Received!',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h1 style="color: #4f46e5; margin-bottom: 20px;">Welcome, ${ownerName}!</h1>
              <p>Thank you for registering your shop, <strong>${shopName}</strong>, on EventWear Rental Hub.</p>
              <p>We have received your application and it is currently being <strong>reviewed by our administration team</strong> to ensure a high-quality marketplace for all users.</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1f2937;">Next Steps:</h3>
                <ul style="margin-bottom: 0;">
                  <li>Admin will verify your documents (Aadhar/PAN).</li>
                  <li>Once verified, you will receive another email confirming your activation.</li>
                  <li>After activation, you can log in and start listing your rental items.</li>
                </ul>
              </div>
              <p>If you have any urgent questions, feel free to reply to this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999;">&copy; 2026 EventWear Rental Hub. All rights reserved.</p>
            </div>
          `
        });
      } catch (err) {
        console.error('❌ Welcome Email Error:', err.message);
        // We don't want to fail the registration if email fails
      }
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
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user = null;

    if (role) {
      // If role is provided, only check that specific model
      if (role === 'admin') {
        user = await Admin.findOne({ email }).select('+password');
      } else if (role === 'vendor') {
        user = await Vendor.findOne({ email }).select('+password');
      } else if (role === 'customer') {
        user = await Customer.findOne({ email }).select('+password');
      } else if (role === 'delivery') {
        user = await DeliveryBoy.findOne({ email }).select('+password');
      } else {
        return res.status(400).json({ success: false, message: 'Invalid role provided' });
      }
    } else {
      // Fallback: Attempt to find user in all models to auto-detect role (existing logic)
      
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

      // Check Delivery if still not found
      if (!user) {
        user = await DeliveryBoy.findOne({ email }).select('+password');
      }
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if vendor is approved
    if (user.role === 'vendor' && !user.isApproved) {
      return res.status(401).json({ 
        success: false, 
        message: 'Your account is pending for admin approval. Please try again later.' 
      });
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
