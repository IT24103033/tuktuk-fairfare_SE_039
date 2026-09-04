const express = require('express');
const router = express.Router();
const { calculateFare, getBenchmarks } = require('../controllers/fareController');

// POST request because the UI will send distance/time data to calculate
router.post('/calculate', calculateFare);

// GET request because the UI just needs to fetch the route benchmark list
router.get('/benchmarks', getBenchmarks);

module.exports = router;