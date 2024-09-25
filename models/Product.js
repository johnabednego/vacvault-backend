const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    unique: true,
    required: true,
    autoIncrement: true
  },
  image: {
    data: Buffer,
    contentType: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
