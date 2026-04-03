const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                access: false
            });
        }

        return res.json({
            message: "Login successful",
            access: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role   // ✅ IMPORTANT
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;