const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json({ success: true, data: admins });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Edit User Information
exports.editUserInfo = async (req, res) => {
  const { first_name, last_name, country, city } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.country = country || user.country;
    user.city = city || user.city;

    await user.save();

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get User Details by ID
exports.getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Logged-in User Information
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
