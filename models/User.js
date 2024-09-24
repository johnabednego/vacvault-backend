const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
  vacvault_id: String,
    first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // This will validate if the phone number has the international country code format
        return /\+\d{1,3}\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    allowNull: false,
    defaultValue: 'user', // Default role
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  email_verification_otp: String,
  email_verification_expires: Date,
  reset_password_otp: String,
  reset_password_expires: Date,
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
