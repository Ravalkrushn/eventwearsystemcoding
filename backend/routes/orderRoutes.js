const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new order & save delivery details
// @access  Public (for now, but ideally would check auth if using user id)
router.post('/', async (req, res) => {
  try {
    const { 
        user, 
        items, 
        totalAmount, 
        shippingAddress 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const newOrder = new Order({
      user,
      items,
      totalAmount,
      shippingAddress,
      paymentStatus: 'Pending',
      orderStatus: 'Order Placed'
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order details saved successfully',
      order: savedOrder
    });
  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + err.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    console.error('❌ Error fetching order:', err);
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update order payment status
router.put('/:id/payment', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    order.paymentStatus = 'Paid';
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address
    };

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('❌ Error updating payment:', err);
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
});

module.exports = router;

