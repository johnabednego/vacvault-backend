const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Shoppings
 *   description: Shopping management
 */

/**
 * @swagger
 * /shoppings:
 *   get:
 *     summary: Get all shopping records
 *     tags: [Shoppings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all shopping records
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, shoppingController.getAllShoppings);

/**
 * @swagger
 * /shoppings/{id}:
 *   get:
 *     summary: Get a shopping record by ID
 *     tags: [Shoppings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Shopping ID
 *     responses:
 *       200:
 *         description: Returns the shopping record
 *       404:
 *         description: Shopping record not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, shoppingController.getShoppingById);

/**
 * @swagger
 * /shoppings/create:
 *   post:
 *     summary: Create a new shopping record
 *     tags: [Shoppings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     color:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Shopping record created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/create', authMiddleware, shoppingController.createShopping);

/**
 * @swagger
 * /shoppings/{id}/update:
 *   put:
 *     summary: Update a shopping record
 *     tags: [Shoppings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Shopping ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     color:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Shopping record updated successfully
 *       404:
 *         description: Shopping record not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/:id/update', authMiddleware, isAdmin, shoppingController.updateShopping);

/**
 * @swagger
 * /shoppings/{id}:
 *   delete:
 *     summary: Delete a shopping record
 *     tags: [Shoppings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Shopping ID
 *     responses:
 *       200:
 *         description: Shopping record deleted successfully
 *       404:
 *         description: Shopping record not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, isAdmin, shoppingController.deleteShopping);

module.exports = router;
