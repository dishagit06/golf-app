const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    score: {
        type: Number,
        required: true,
        min: 1,   // ✅ PRD rule
        max: 45
    },

    date: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true }); // ✅ createdAt, updatedAt

module.exports = mongoose.model("Score", scoreSchema);