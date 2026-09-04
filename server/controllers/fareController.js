const Benchmark = require('../models/Benchmark');
const fallbackBenchmarkData = require('../data/benchmarks.json');

// Calculate TukTuk fare based on distance and night surcharge
const calculateFare = (req, res) => {
    const { distanceKm, isNightTime } = req.body;

    // Validation: Check for non-numeric or negative distance
    if (distanceKm === undefined || typeof distanceKm !== 'number' || distanceKm <= 0) {
        return res.status(400).json({ error: "Invalid distance provided. Distance must be a positive number." });
    }

    // Math Step 1: Base fare for 1st km (LKR 110 or 80 standard rate)
    let totalFare = 110;

    // Math Step 2: LKR 90 per subsequent km
    if (distanceKm > 1) {
        const extraDistance = distanceKm - 1;
        totalFare += (extraDistance * 90);
    }

    // Math Step 3: 15% surcharge for night-time rides
    if (isNightTime === true) {
        totalFare += (totalFare * 0.15);
    }

    res.status(200).json({
        distanceKm: distanceKm,
        isNightTime: !!isNightTime,
        finalFairPrice: Math.round(totalFare)
    });
};

// Fetch benchmark routes from MongoDB Atlas with optional search filter
const getBenchmarks = async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let query = {};

        if (searchQuery) {
            query = { route: { $regex: searchQuery, $options: 'i' } };
        }

        const benchmarks = await Benchmark.find(query).sort({ id: 1 });
        
        // If DB is empty, return static JSON data as fallback
        if (!benchmarks || benchmarks.length === 0) {
            if (searchQuery) {
                const filteredFallback = fallbackBenchmarkData.filter(item =>
                    item.route.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return res.status(200).json(filteredFallback);
            }
            return res.status(200).json(fallbackBenchmarkData);
        }

        res.status(200).json(benchmarks);
    } catch (error) {
        console.error('Error fetching benchmarks from DB:', error.message);
        res.status(500).json({ error: "Server error fetching benchmarks from database." });
    }
};

// Add a new benchmark route to MongoDB Atlas with schema validation
const createBenchmark = async (req, res) => {
    try {
        const { id, route, distanceKm, estimatedFare, scamAlert } = req.body;

        const newBenchmark = new Benchmark({
            id,
            route,
            distanceKm,
            estimatedFare,
            scamAlert
        });

        const savedBenchmark = await newBenchmark.save();
        res.status(201).json({
            message: "Benchmark route created successfully!",
            benchmark: savedBenchmark
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: "Validation Error", details: errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: "Duplicate Error", details: ["Benchmark with this ID already exists."] });
        }
        console.error('Error creating benchmark:', error.message);
        res.status(500).json({ error: "Failed to create benchmark route." });
    }
};

module.exports = {
    calculateFare,
    getBenchmarks,
    createBenchmark
};