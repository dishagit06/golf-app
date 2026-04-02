const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,

    // Basic fields
    plan: {
        type: String,
        default: "none"
    },

    charity: {
        type: String,
        default: "none"
    },

    // ✅ SUBSCRIPTION SYSTEM
    subscriptionStatus: {
        type: String,
        default: "active"   // inactive | active
    },

    subscriptionPlan: {
        type: String,
        default: "none"       // basic | premium
    },

    // ✅ ROLE SYSTEM (ADMIN SUPPORT)
    role: {
        type: String,
        default: "user"       // user | admin
    },

    // ✅ CHARITY IMPROVEMENT (DONATION TRACKING)
    charityAmount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("User", userSchema);