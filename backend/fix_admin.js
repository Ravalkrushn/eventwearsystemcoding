require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const email = "admin@gmail.com";
    const password = "qwaszx@123";

    // Delete existing admin if any
    await Admin.deleteOne({ email });

    // Create fresh admin
    const admin = new Admin({
      fullName: "Super Admin",
      email: email,
      password: password, // The model will hash it in pre-save
      role: "admin"
    });

    await admin.save();
    console.log('✅ Admin fixed successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

fixAdmin();
