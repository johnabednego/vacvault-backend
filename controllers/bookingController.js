const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const { getGridfsBucket } = require('../config/db');
const { sendEmail } = require('../utils/email');
const { Readable } = require('stream');

// Create Booking
exports.createBooking = async (req, res) => {
  const { items, price, is_in_school, school_name, name_of_hall, capital_city, town, area, can_call, pickup_date, delivery_date, storage_duration } = req.body;

  try {
    const booking = new Booking({
      items,
      price,
      is_in_school,
      school_name,
      name_of_hall,
      capital_city,
      town,
      area,
      can_call,
      pickup_date,
      delivery_date,
      storage_duration,
    });

    await booking.save();

    // Send success email
    const user = req.user; // Assuming req.user contains authenticated user info
    await sendEmail(user.email, 'Booking Created', `Your booking has been successfully created. Booking ID: ${booking.booking_id}`);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Upload Item Image
exports.uploadItemImage = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    const gridfsBucket = getGridfsBucket();

    // Check if there's a file to upload
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);  // Assuming file is in buffer
    readableStream.push(null);

    const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    readableStream.pipe(uploadStream)
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error uploading file' });
      })
      .on('finish', async () => {
        booking.item_image = uploadStream.id;  // Save the file ID in the booking
        await booking.save();

        res.status(200).json({ success: true, message: 'Image uploaded successfully', fileId: uploadStream.id });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Fetch Item Image
exports.getItemImage = async (req, res) => {
  const { fileId } = req.params;

  try {
    const gridfsBucket = getGridfsBucket();

    const file = await gridfsBucket.find({ _id: mongoose.Types.ObjectId(fileId) }).toArray();
    if (!file || file.length === 0) return res.status(404).json({ msg: 'No file exists' });

    // Check if file is an image
    if (file[0].contentType === 'image/jpeg' || file[0].contentType === 'image/png') {
      const downloadStream = gridfsBucket.openDownloadStream(mongoose.Types.ObjectId(fileId));
      downloadStream.pipe(res);
    } else {
      res.status(400).json({ msg: 'Not an image' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Booking
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { status, items, price, pickup_date, delivery_date } = req.body;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    booking.status = status || booking.status;
    booking.items = items || booking.items;
    booking.price = price || booking.price;
    booking.pickup_date = pickup_date || booking.pickup_date;
    booking.delivery_date = delivery_date || booking.delivery_date;

    if (status === 'Active' && !booking.item_image) {
      return res.status(400).json({ msg: 'Image required for delivery' });
    }

    await booking.save();

    if (status === 'Active') {
      // Send notification for active status
      await sendEmail(req.user.email, 'Booking Activated', `Your booking with ID ${booking.booking_id} is now active.`);
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    await booking.remove();
    res.status(200).json({ success: true, data: 'Booking deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Get all bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('items') // Populate related items
      .populate('item_image'); // Populate item images

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all bookings for a particular user
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user contains authenticated user info
    const bookings = await Booking.find({ user: userId })
      .populate('items') // Populate related items
      .populate('item_image'); // Populate item images

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id)
      .populate('items') // Populate related items
      .populate('item_image'); // Populate item images

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
