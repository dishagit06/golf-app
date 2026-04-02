const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Score = require("../models/Score");

// ================= GET ALL USERS =================
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users ❌" });
    }
});

// ================= UPDATE SUBSCRIPTION =================
router.post("/update-subscription", async (req, res) => {
    try {
        const { userId, status } = req.body;

        if (!userId || !status) {
            return res.status(400).json({ message: "Missing fields ❌" });
        }

        await User.findByIdAndUpdate(userId, {
            subscriptionStatus: status
        });

        res.json({ message: "Subscription updated ✅" });

    } catch (err) {
        res.status(500).json({ message: "Error updating subscription ❌" });
    }
});

// ================= GET ALL SCORES =================
router.get("/scores", async (req, res) => {
    try {
        const scores = await Score.find();
        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: "Error fetching scores ❌" });
    }
});

// ================= CHARITY REPORT =================
router.get("/charity-report", async (req, res) => {
    try {
        const users = await User.find();

        const report = users.map(u => ({
            name: u.name,
            email: u.email,
            charity: u.charity || "Not selected",
            subscription: u.subscriptionStatus || "inactive"
        }));

        res.json(report);

    } catch (err) {
        res.status(500).json({ message: "Error generating report ❌" });
    }
});

module.exports = router;