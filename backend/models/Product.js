const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  productName: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please add rental price per day']
  },
  deposit: {
    type: Number,
    required: [true, 'Please add security deposit']
  },
  size: {
    type: String,
    required: [true, 'Please select a size']
  },
  color: String,
  material: String,
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
