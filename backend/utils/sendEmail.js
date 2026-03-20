const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Helps with some local dev issues
      }
    });

    const mailOptions = {
      from: `"EventWear Rental Hub" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    console.log(`📤 Attempting to send email to: ${options.email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error('❌ Nodemailer Error:', error.message);
    if (error.message.includes('535')) {
      console.error('👉 Tip: Check if your Gmail App Password is correct and 2FA is enabled.');
    }
    throw new Error('Email sending failed: ' + error.message);
  }
};

module.exports = sendEmail;
