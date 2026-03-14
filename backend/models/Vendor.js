const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  shopAddress: {
    type: String,
    required: [true, 'Shop address is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar number is required'],
    // unique: true
  },
  panNumber: {
    type: String,
    required: [true, 'PAN number is required'],
    // unique: true
  },
  bankAccount: {
    type: String,
    required: [true, 'Bank account number is required']
  },
  ifscCode: {
    type: String,
    required: [true, 'IFSC code is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    default: 'vendor'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  shopImage: {
    type: String,
    // required: [true, 'Shop image is required'] // Making it optional for now or required based on user's need. User said "ak shop ka photo bhi ho"
  }
}, { timestamps: true });

// Hash password before saving
vendorSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
vendorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Vendor', vendorSchema);
