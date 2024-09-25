const Shopping = require('../models/Shopping');

// Get all shopping records
exports.getAllShoppings = async (req, res) => {
  try {
    const shoppings = await Shopping.find().populate('products.product');
    res.status(200).json({ success: true, data: shoppings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get shopping record by ID
exports.getShoppingById = async (req, res) => {
  try {
    const shopping = await Shopping.findById(req.params.id).populate('products.product');
    if (!shopping) {
      return res.status(404).json({ success: false, message: 'Shopping record not found' });
    }
    res.status(200).json({ success: true, data: shopping });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new shopping record
exports.createShopping = async (req, res) => {
  const { products } = req.body;

  try {
    const newShopping = new Shopping({ products });
    await newShopping.save();
    res.status(201).json({ success: true, data: newShopping });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a shopping record
exports.updateShopping = async (req, res) => {
  try {
    const shopping = await Shopping.findById(req.params.id);
    if (!shopping) {
      return res.status(404).json({ success: false, message: 'Shopping record not found' });
    }

    // Update the fields
    shopping.products = req.body.products || shopping.products;
    
    await shopping.save();
    res.status(200).json({ success: true, data: shopping });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a shopping record
exports.deleteShopping = async (req, res) => {
  try {
    const shopping = await Shopping.findById(req.params.id);
    if (!shopping) {
      return res.status(404).json({ success: false, message: 'Shopping record not found' });
    }

    await shopping.remove();
    res.status(200).json({ success: true, message: 'Shopping record deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
