const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true   // ✅ important
    },

    password: {
        type: String,
        required: true
    },

    // ================= PLAN =================
    plan: {
        type: String,
        default: "none"
    },

    // ================= CHARITY =================
    charity: {
        type: String,
        default: "none"
    },

    charityAmount: {
        type: Number,
        default: 0
    },

    // ================= SUBSCRIPTION =================
    subscriptionStatus: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    subscriptionPlan: {
        type: String,
        enum: ["monthly", "yearly", "none"],
        default: "none"
    },

    subscriptionStart: {
        type: Date,
        default: Date.now
    },

    subscriptionEnd: {
        type: Date
    },

    // ================= ROLE =================
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

}, { timestamps: true }); // ✅ createdAt, updatedAt

module.exports = mongoose.model("User", userSchema);