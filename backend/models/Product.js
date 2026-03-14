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
    required: [true, 'Please select a category'],
    enum: [
      "Wedding Wear",
      "Party Wear",
      "Festival Wear",
      "Formal Wear",
      "Traditional Wear",
      "Western Wear",
      "Other"
    ]
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
    required: [true, 'Please select a size'],
    enum: ["S", "M", "L", "XL", "XXL", "Free Size"]
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
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
