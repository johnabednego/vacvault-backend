const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Counter Schema for auto-incrementing vacvault_id
const CounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  sequence_value: {
    type: Number,
    default: 0,
  },
});

// Create Counter model
const Counter = mongoose.model('Counter', CounterSchema);

// User Schema
const UserSchema = new mongoose.Schema({
  vacvault_id: {
    type: Number,
    unique: true, // Ensure uniqueness
  },
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
    default: 'user', // Default role
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

// Middleware to auto-increment vacvault_id before saving
UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'vacvault_id' }, 
      { $inc: { sequence_value: 1 } }, 
      { new: true, upsert: true } // Create if not exists
    );
    this.vacvault_id = counter.sequence_value;
  }
  next();
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
