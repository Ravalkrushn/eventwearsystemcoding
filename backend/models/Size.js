const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a size name (e.g., XS)'],
    trim: true
  },
  ageRange: {
    type: String,
    required: [true, 'Please add an age range (e.g., 12–14 yrs)'],
    trim: true
  },

  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Size', sizeSchema);
