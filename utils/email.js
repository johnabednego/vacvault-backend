const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // If you're using port 587 (STARTTLS), set secure to false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // For development, in case you encounter SSL issues
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"VacVault" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error('Email not sent');
  }
};

module.exports = {
  sendEmail,
};
