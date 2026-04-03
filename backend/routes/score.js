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
                message: "Email and score required ❌"
            });
        }

        if (score < 1 || score > 45) {
            return res.json({
                message: "Score must be between 1–45 ❌"
            });
        }

        // SAVE SCORE
        const newScore = new Score({ email, score });
        await newScore.save();

        // 🔥 KEEP ONLY LAST 5 SCORES (PRD FIX)
        const allScores = await Score.find({ email }).sort({ _id: -1 });

        if (allScores.length > 5) {
            const extra = allScores.slice(5);

            for (let s of extra) {
                await Score.findByIdAndDelete(s._id);
            }
        }

        // CHARITY (10%)
        const charityAmount = Number(score) * 0.10;

        await User.findOneAndUpdate(
            { email },
            { $inc: { charityAmount } }
        );

        return res.json({
            message: "Score added successfully ✅",
            charityAmount
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error ❌"
        });
    }
});


// ================= GET USER SCORES =================
router.get("/score/:email", async (req, res) => {
    try {
        const scores = await Score.find({ email: req.params.email })
            .sort({ _id: -1 })
            .limit(5);

        return res.json({
            scores: scores.map(s => s.score)
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server error ❌"
        });
    }
});


// ================= LEADERBOARD =================
router.get("/leaderboard", async (req, res) => {
    try {
        const data = await Score.aggregate([
            {
                $group: {
                    _id: "$email",
                    total: { $sum: "$score" }
                }
            },
            { $sort: { total: -1 } }
        ]);

        const leaderboard = data.map(d => ({
            email: d._id,
            total: d.total
        }));

        return res.json({
            leaderboard,
            top3: leaderboard.slice(0, 3)
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server error ❌"
        });
    }
});

module.exports = router;