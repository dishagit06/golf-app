const express = require("express");
const router = express.Router();
const User = require("../models/User");


// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required ❌"
            });
        }

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password ❌",
                access: false
            });
        }

        return res.json({
            message: "Login successful ✅",
            access: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus,
                role: user.role
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error ❌"
        });
    }
});


// ================= CHARITY LIST =================
router.get("/charity-list", (req, res) => {
    try {
        res.json([
            "Red Cross",
            "Save Children",
            "Cancer Foundation",
            "Animal Welfare"
        ]);
    } catch {
        res.status(500).json({
            message: "Error fetching charities ❌"
        });
    }
});


module.exports = router;