/**
 * Market Routes
 */

const express = require('express');
const router = express.Router();
const MarketController = require('../controllers/marketController');

// Marketplace
router.get('/', MarketController.renderMarketplace);
router.get('/cart', MarketController.renderCart);

// API for cache management (development)
router.get('/api/cache-clear', MarketController.clearCache);

// Pokémon details
router.get('/api/pokemon/:id', MarketController.getPokemonDetail);

module.exports = router;
