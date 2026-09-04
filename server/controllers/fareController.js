const benchmarkData = require('../data/benchmarks.json');

// This will hold our standard LKR tuk-tuk rate formula
const calculateFare = (req, res) => {
    // Extract the exact distance and a true/false night time flag from the UI
    const { distanceKm, isNightTime } = req.body;

    // Validation: Catch bad data (like negative distances) so the server doesn't crash
    if (distanceKm === undefined || distanceKm < 0) {
        return res.status(400).json({ error: "Invalid distance provided. Please enter a valid number." });
    }

    // Math Step 1: Base fare for the 1st kilometer is LKR 80
    let totalFare = 80;

    // Math Step 2: Every additional kilometer costs LKR 60
    if (distanceKm > 1) {
        const extraDistance = distanceKm - 1;
        totalFare += (extraDistance * 60);
    }

    // Math Step 3: Apply a 25% surcharge for night-time rides
    if (isNightTime === true) {
        totalFare = totalFare + (totalFare * 0.25);
    }

    // Send the final result back to the frontend, rounding off any decimals
    res.status(200).json({
        distance: distanceKm,
        finalFairPrice: Math.round(totalFare)
    });
};


// This will handle searching the standard route benchmark dataset
const getBenchmarks = (req, res) => {
    // The UI member will send a search term in the URL, e.g., ?search=Galle
    const searchQuery = req.query.search;

    // If there is no search term, return the entire list
    if (!searchQuery) {
        return res.status(200).json(benchmarkData);
    }

    // Filter the data: check if the route name includes the search term (ignoring uppercase/lowercase)
    const filteredData = benchmarkData.filter(item =>
        item.route.toLowerCase().includes(searchQuery.toLowerCase())
    );

    res.status(200).json(filteredData);
};

module.exports = {
    calculateFare,
    getBenchmarks
};