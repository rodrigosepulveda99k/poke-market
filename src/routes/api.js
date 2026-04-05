/**
 * API Routes - Cart operations
 */

const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Cart operations
router.post('/cart/add', CartController.addToCart);
router.post('/cart/remove', CartController.removeFromCart);
router.post('/cart/update-quantity', CartController.updateQuantity);
router.get('/cart/summary', CartController.getCartSummary);
router.post('/cart/checkout', CartController.checkout);
router.post('/cart/clear', CartController.clearCart);

module.exports = router;
