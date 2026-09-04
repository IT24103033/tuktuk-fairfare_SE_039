const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const connectDB = require('../config/db');
const Benchmark = require('../models/Benchmark');
const benchmarkData = require('../data/benchmarks.json');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Benchmark.deleteMany();
        console.log('Existing benchmarks removed.');

        // Insert mock benchmark data
        const insertedData = await Benchmark.insertMany(benchmarkData);
        console.log(`Successfully seeded ${insertedData.length} benchmark routes into MongoDB Atlas!`);

        process.exit(0);
    } catch (error) {
        console.error(`Seeding Failed: ${error.message}`);
        process.exit(1);
    }
};

seedData();
