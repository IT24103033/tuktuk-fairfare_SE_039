const express = require('express');
const router = express.Router();
const {
    calculateFare,
    getBenchmarks,
    createBenchmark,
    updateBenchmark,
    deleteBenchmark,
    addCommentToBenchmark
} = require('../controllers/fareController');

// POST request to calculate TukTuk fare
router.post('/calculate', calculateFare);

// GET request to fetch route benchmarks
router.get('/benchmarks', getBenchmarks);

// POST request to add a new benchmark route
router.post('/benchmarks', createBenchmark);

// PUT request to update an existing benchmark route
router.put('/benchmarks/:id', updateBenchmark);

// DELETE request to delete a benchmark route
router.delete('/benchmarks/:id', deleteBenchmark);

// POST request to add a community comment/scam report to a benchmark route
router.post('/benchmarks/:id/comments', addCommentToBenchmark);

module.exports = router;