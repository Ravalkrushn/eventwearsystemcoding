require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');

async function test() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const testVendor = {
      ownerName: 'Test Owner',
      shopName: 'Test Shop',
      email: `test${Date.now()}@test.com`,
      phone: '1234567890',
      shopAddress: 'Test Address',
      city: 'Test City',
      aadharNumber: `AADHAR${Date.now()}`,
      panNumber: `PAN${Date.now()}`,
      bankAccount: '1234567890',
      ifscCode: 'IFSC0001',
      password: 'password123'
    };

    console.log('Creating vendor with data:', JSON.stringify(testVendor, null, 2));
    const result = await Vendor.create(testVendor);
    console.log('Vendor created successfully:', result.email);
    process.exit(0);
  } catch (error) {
    require('fs').writeFileSync('error.log', error.stack || error.message);
    process.exit(1);
  }
}

test();
