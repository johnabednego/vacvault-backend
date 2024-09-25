const mongoose = require('mongoose');

const ShoppingSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    color: String,
    quantity: Number
  }],
  shopping_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shopping', ShoppingSchema);
