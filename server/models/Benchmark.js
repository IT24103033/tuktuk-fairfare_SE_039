const mongoose = require('mongoose');

const benchmarkSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, 'Benchmark ID is required'],
            unique: true
        },
        route: {
            type: String,
            required: [true, 'Route name is required'],
            trim: true,
            minlength: [3, 'Route name must be at least 3 characters long']
        },
        distanceKm: {
            type: Number,
            required: [true, 'Distance in Km is required'],
            min: [0.1, 'Distance must be greater than 0']
        },
        estimatedFare: {
            type: Number,
            required: [true, 'Estimated fare is required'],
            min: [0, 'Estimated fare cannot be negative']
        },
        scamAlert: {
            type: String,
            required: [true, 'Scam alert information is required'],
            trim: true,
            minlength: [5, 'Scam alert must be at least 5 characters long']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Benchmark', benchmarkSchema);
