const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  type: {
    type: String,
    enum: ['Custom Fitting', 'Cancellation', 'Return', 'Security Deposit'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  disclaimer: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Ensure one type of policy per vendor for simplicity (can adjust if needed)
policySchema.index({ vendor: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Policy', policySchema);
