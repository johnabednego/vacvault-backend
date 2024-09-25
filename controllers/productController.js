const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    // Convert images to Base64
    const productsWithImages = products.map(product => ({
      ...product._doc,
      image: {
        data: product.image.data.toString('base64'), // Convert to Base64
        contentType: product.image.contentType,
      },
    }));

    res.status(200).json({ success: true, data: productsWithImages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Convert image to Base64
    const productWithImage = {
      ...product._doc,
      image: {
        data: product.image.data.toString('base64'), // Convert to Base64
        contentType: product.image.contentType,
      },
    };

    res.status(200).json({ success: true, data: productWithImage });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new Product with image upload
exports.createProduct = async (req, res) => {
  const { name, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const newProduct = new Product({
      image: {
        data: file.buffer,
        contentType: file.mimetype,
      },
      name,
      description,
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update the fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;

    // Check for image upload
    if (req.file) {
      product.image.data = req.file.buffer;
      product.image.contentType = req.file.mimetype;
    }

    await product.save();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.remove();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
