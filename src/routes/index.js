const express = require('express');
const pollRoutes = require('./pollRoutes');

const router = express.Router();
router.use('/', pollRoutes);

module.exports = router;