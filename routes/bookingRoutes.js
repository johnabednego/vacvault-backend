const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /bookings/create:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - price
 *               - is_in_school
 *               - can_call
 *               - pickup_date
 *               - delivery_date
 *               - storage_duration
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ObjectId reference to items
 *               price:
 *                 type: number
 *               is_in_school:
 *                 type: boolean
 *               school_name:
 *                 type: string
 *               name_of_hall:
 *                 type: string
 *               capital_city:
 *                 type: string
 *               town:
 *                 type: string
 *               area:
 *                 type: string
 *               can_call:
 *                 type: boolean
 *               pickup_date:
 *                 type: string
 *                 format: date
 *               delivery_date:
 *                 type: string
 *                 format: date
 *               storage_duration:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/bookings/create', authMiddleware, bookingController.createBooking);

/**
 * @swagger
 * /bookings/{id}/upload-image:
 *   post:
 *     summary: Upload an image for a booking item
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.post('/bookings/:id/upload-image', authMiddleware, bookingController.uploadItemImage);

/**
 * @swagger
 * /bookings/image/{fileId}:
 *   get:
 *     summary: Fetch an item image
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *         required: true
 *         description: Image file ID
 *     responses:
 *       200:
 *         description: Returns the image file
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get('/bookings/image/:fileId', bookingController.getItemImage);

/**
 * @swagger
 * /bookings/{id}/update:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Active, Cancelled]
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               pickup_date:
 *                 type: string
 *                 format: date
 *               delivery_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Image required for delivery if status is Active
 *       500:
 *         description: Server error
 */
router.put('/bookings/:id/update', authMiddleware, bookingController.updateBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.delete('/bookings/:id', authMiddleware, bookingController.deleteBooking);

/**
 * @swagger
 * /bookings/user:
 *   get:
 *     summary: Get all bookings for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user's bookings
 *       500:
 *         description: Server error
 */
router.get('/bookings/user', authMiddleware, bookingController.getUserBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Returns the booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.get('/bookings/:id', authMiddleware, bookingController.getBookingById);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all bookings
 *       500:
 *         description: Server error
 */
router.get('/bookings', authMiddleware, bookingController.getAllBookings);

module.exports = router;
