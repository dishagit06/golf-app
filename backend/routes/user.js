const express = require("express");
const router = express.Router();
const User = require("../models/User");


// ================= LOGIN ROUTE =================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                access: false
            });
        }

        // success login (NO SUBSCRIPTION CHECK)
        return res.json({
            message: "Login successful",
            access: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= CHARITY LIST ROUTE =================
router.get("/charity-list", (req, res) => {
    res.json([
        "Red Cross",
        "Save Children",
        "Cancer Foundation",
        "Animal Welfare"
    ]);
});


// export router
module.exports = router;