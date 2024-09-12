// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment-controller'); // Ensure the correct path

// Route to render the product page
router.get('/product', paymentController.getProductPage);

// Route to create an order
router.post('/create-order', paymentController.createOrder);

// Route to handle payment success
router.post('/success', paymentController.paymentSuccess);

module.exports = router;
