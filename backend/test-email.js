const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  console.log('Testing Email Configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '********' : 'NOT SET');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Nodemailer Test',
      text: 'This is a test email.'
    });
    console.log('✅ Success! Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Failed:', error);
  }
};

testEmail();
