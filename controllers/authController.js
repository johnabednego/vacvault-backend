const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

// Utility Functions
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = (payload, expiresIn = '1h') => jwt.sign(payload, jwtSecret, { expiresIn });

// Register User
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {first_name, last_name, email, phone_number, password, country, city, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const email_verification_otp = generateOTP();
    const email_verification_expires = Date.now() + 3600000; // 1 hour

    user = new User({
      first_name,
      last_name,
      email,
      phone_number,
      password,
      country,
      city,
      role, // Optional, defaults to 'user'
      email_verification_otp,
      email_verification_expires,
    });

    await user.save();
    await sendEmail(email, 'Verify your email', `Your OTP is ${email_verification_otp}`);

    res.status(201).json({ msg: 'User registered. Check your email for verification.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.is_verified) {
      const email_verification_otp = generateOTP();
      user.email_verification_otp = email_verification_otp;
      user.email_verification_expires = Date.now() + 3600000;

      await user.save();
      await sendEmail(email, 'Verify your email', `Your OTP is ${email_verification_otp}`);

      return res.status(400).json({ msg: 'Email not verified. A new OTP has been sent.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, user: user });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify Email OTP
exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    if (user.email_verification_otp !== otp || user.email_verification_expires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    user.is_verified = true;
    user.email_verification_otp = null;
    user.email_verification_expires = null;

    await user.save();

    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    const reset_password_otp = generateOTP();
    const reset_password_expires = Date.now() + 3600000; // 1 hour

    user.reset_password_otp = reset_password_otp;
    user.reset_password_expires = reset_password_expires;

    await user.save();
    await sendEmail(email, 'Password Reset', `Your OTP is ${reset_password_otp}`);

    res.status(200).json({ msg: 'Password reset OTP sent to email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify Password Reset OTP
exports.verifyPasswordResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.reset_password_expires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    res.status(200).json({ msg: 'OTP verified. You can now set a new password.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Set New Password
exports.setNewPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.reset_password_otp !== otp || user.reset_password_expires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }


    user.password = newPassword;
    user.reset_password_otp = null;
    user.reset_password_expires = null;

    await user.save();

    res.status(200).json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
