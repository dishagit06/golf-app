const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Score = require("../models/Score");


// ================= GET ALL USERS =================
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.json({
            totalUsers: users.length,
            users
        });

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


// ================= DELETE USER =================
router.delete("/delete-user/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: "User deleted ✅" });

    } catch (err) {
        res.status(500).json({ message: "Error deleting user ❌" });
    }
});


// ================= GET ALL SCORES =================
router.get("/scores", async (req, res) => {
    try {
        const scores = await Score.find().sort({ createdAt: -1 });

        res.json({
            totalScores: scores.length,
            scores
        });

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
            contribution: u.charityAmount || 0,
            subscription: u.subscriptionStatus || "inactive"
        }));

        res.json(report);

    } catch (err) {
        res.status(500).json({ message: "Error generating report ❌" });
    }
});


// ================= BASIC ANALYTICS =================
router.get("/analytics", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalScores = await Score.countDocuments();

        const totalCharity = await User.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$charityAmount" }
                }
            }
        ]);

        res.json({
            totalUsers,
            totalScores,
            totalCharity: totalCharity[0]?.total || 0
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching analytics ❌" });
    }
});


module.exports = router;