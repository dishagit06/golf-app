const express = require("express");
const router = express.Router();

const Score = require("../models/Score");
const User = require("../models/User");


// ================= ADD SCORE =================
router.post("/score", async (req, res) => {
    try {
        const { email, score } = req.body;

        if (!email || !score) {
            return res.status(400).json({
                message: "Email and score required"
            });
        }

        // ================= SAVE SCORE =================
        const newScore = new Score({
            email,
            score
        });

        await newScore.save();

        // ================= CHARITY LOGIC (10%) =================
        const charityAmount = Number(score) * 0.10;

        console.log("10% goes to charity:", charityAmount);

        // update user charity total
        await User.findOneAndUpdate(
            { email },
            { $inc: { charityAmount: charityAmount } }
        );

        return res.json({
            message: "Score added successfully",
            score,
            charityAmount
        });

    } catch (err) {
        console.log("Score save error:", err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= GET USER SCORES =================
router.get("/score/:email", async (req, res) => {
    try {
        const email = req.params.email;

        const scores = await Score.find({ email })
            .sort({ _id: -1 }) // latest first
            .limit(5); // last 5 scores only

        return res.json({
            email,
            scores: scores.map(s => s.score)
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= LEADERBOARD =================
router.get("/leaderboard", async (req, res) => {
    try {
        const topUsers = await Score.aggregate([
            {
                $group: {
                    _id: "$email",
                    totalScore: { $sum: "$score" }
                }
            },
            { $sort: { totalScore: -1 } }
        ]);

        // top 3 users
        const top3 = topUsers.slice(0, 3);

        return res.json({
            leaderboard: topUsers.map(u => ({
                email: u._id,
                score: u.totalScore
            })),
            top3: top3.map(u => ({
                email: u._id,
                score: u.totalScore
            }))
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;