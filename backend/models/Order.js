const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false // Optional if guest checkout is allowed, but here we likely have users
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
      },
      name: String,
      price: Number,
      duration: Number,
      deliveryDate: String,
      returnDate: String,
      image: String,
      deliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryBoy',
        default: null
      },
      deliveryStatus: {
        type: String,
        enum: ['Pending', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered', 'Returned'],
        default: 'Pending'
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    address: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true }
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
