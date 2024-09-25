const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  }],
  price: {
    type: Number,
    required: true
  },
  is_in_school: {
    type: Boolean,
    required: true,
  },
  school_name: String,
  name_of_hall: String,
  capital_city: String,
  town: String,
  area: String,
  can_call: {
    type: Boolean,
    required: true,
  },
  pickup_date: {
    type: Date,
    required: true
  },
  delivery_date: {
    type: Date,
    required: true
  },
  storage_duration: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Cancelled'],
    default: 'Pending',
    required: true
  },
  item_image: {
    type: String, // Path to image stored in your file system or cloud
    required: function () {
      return this.status === 'Pending' ? false : true; // Require image for delivery
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
