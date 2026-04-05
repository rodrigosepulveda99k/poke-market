const express = require('express');
const marketRoutes = require('./routes/market');
const apiRoutes = require('./routes/api');

const router = express.Router();

// Use market routes
router.use('/', marketRoutes);

// Use API routes
router.use('/api', apiRoutes);

module.exports = router;