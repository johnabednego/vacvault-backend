const mongoose = require('mongoose');
const Item = require('../models/Item');

// Create Item
exports.createItem = async (req, res) => {
  const { name, price } = req.body;

  try {
    const item = new Item({
      name,
      price,
    });

    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get All Items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Item by ID
exports.getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Item
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.name = name || item.name;
    item.price = price || item.price;

    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Item
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    await item.remove();
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
