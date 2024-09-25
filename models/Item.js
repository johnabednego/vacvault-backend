const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  item_id: {
    type: Number,
    unique: true,
    required: true,
    autoIncrement: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
