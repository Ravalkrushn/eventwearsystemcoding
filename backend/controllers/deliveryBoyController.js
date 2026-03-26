const DeliveryBoy = require('../models/DeliveryBoy');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// @desc    Add a delivery boy (by Vendor)
// @route   POST /api/delivery-boys
// @access  Private (Vendor)
exports.addDeliveryBoy = async (req, res, next) => {
  try {
    const { name, email, phone, password, vendorId } = req.body;

    console.log('📦 addDeliveryBoy called with:', { name, email, phone, vendorId });

    // Validate required fields manually for clear error messages
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and password are required.' });
    }

    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'Vendor ID is missing. Please log in again.' });
    }

    // Validate vendorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ success: false, message: 'Invalid Vendor ID format.' });
    }

    const deliveryBoy = await DeliveryBoy.create({
      name,
      email,
      phone,
      password,
      vendor: vendorId
    });

    console.log('✅ Delivery boy created:', deliveryBoy._id);

    res.status(201).json({
      success: true,
      data: deliveryBoy
    });
  } catch (error) {
    console.error('❌ addDeliveryBoy Error:', error.name, error.message);

    // Duplicate email
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'This email is already registered as a delivery boy.' });
    }

    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // Mongoose Cast Error (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: `Invalid value for field: ${error.path}` });
    }

    next(error);
  }
};

// @desc    Get all delivery boys for a specific vendor
// @route   GET /api/delivery-boys/vendor/:vendorId
// @access  Private (Vendor)
exports.getVendorDeliveryBoys = async (req, res, next) => {
  try {
    const deliveryBoys = await DeliveryBoy.find({ vendor: req.params.vendorId });

    res.status(200).json({
      success: true,
      count: deliveryBoys.length,
      data: deliveryBoys
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery boy status
// @route   PUT /api/delivery-boys/:id
// @access  Private (Vendor)
exports.updateDeliveryBoy = async (req, res, next) => {
  try {
    const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery Boy not found' });
    }

    res.status(200).json({
      success: true,
      data: deliveryBoy
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete delivery boy
// @route   DELETE /api/delivery-boys/:id
// @access  Private (Vendor)
exports.deleteDeliveryBoy = async (req, res, next) => {
  try {
    const deliveryBoy = await DeliveryBoy.findByIdAndDelete(req.params.id);

    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery Boy not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery Boy removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get all tasks assigned to a specific delivery boy
// @route   GET /api/delivery-boys/tasks/:id
// @access  Private (Delivery Boy)
exports.getDeliveryBoyTasks = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find orders where at least one item is assigned to this delivery boy
    const orders = await Order.find({
      'items.deliveryBoy': id
    })
    .populate('items.vendor', 'shopName shopAddress phone')
    .sort({ createdAt: -1 });

    // Filter items in each order to only include items assigned to this delivery boy
    const tasks = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => item.deliveryBoy?.toString() === id);
      return orderObj;
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery status of a task
// @route   PUT /api/delivery-boys/tasks/:orderId/status
// @access  Private (Delivery Boy)
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { deliveryBoyId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update only items assigned to this delivery boy
    order.items.forEach(item => {
      if (item.deliveryBoy?.toString() === deliveryBoyId) {
        item.deliveryStatus = status;
      }
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`
    });
  } catch (error) {
    next(error);
  }
};
