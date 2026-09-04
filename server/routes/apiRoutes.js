const express = require('express');
const router = express.Router();
const { calculateFare, getBenchmarks, createBenchmark } = require('../controllers/fareController');

// POST request to calculate TukTuk fare
router.post('/calculate', calculateFare);

// GET request to fetch route benchmarks
router.get('/benchmarks', getBenchmarks);

// POST request to add a new benchmark route
router.post('/benchmarks', createBenchmark);

module.exports = router;