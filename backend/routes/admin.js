const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Score = require("../models/Score");

// GET ALL USERS
router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// UPDATE SUBSCRIPTION
router.post("/update-subscription", async (req, res) => {
    const { userId, status } = req.body;

    await User.findByIdAndUpdate(userId, {
        subscriptionStatus: status
    });

    res.json({ message: "Subscription updated" });
});

// GET SCORES
router.get("/scores", async (req, res) => {
    const scores = await Score.find();
    res.json(scores);
});

router.get("/charity-report", async (req, res) => {
    const users = await User.find();

    const report = users.map(u => ({
        user: u.name,
        charity: u.charity,
        subscription: u.subscriptionStatus
    }));

    res.json(report);
});

module.exports = router;