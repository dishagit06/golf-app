const express = require("express");
const cors = require("cors");

const connectDB = require("./db");

const User = require("./models/User");
const Score = require("./models/Score");

// ================= ROUTES =================
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());


// ================= DB CONNECT =================
connectDB();


// ================= ROUTE MIDDLEWARE =================
app.use("/admin", adminRoutes);


// ================= SIGNUP =================
app.post("/subscribe", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.json({ message: "User registered ✅" });

    } catch (err) {
        res.status(500).json({ message: "Signup error ❌" });
    }
});


// ================= LOGIN (NO SUBSCRIPTION CHECK) =================
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.json({ message: "Invalid credentials", access: false });
        }

        res.json({
            message: "Login successful",
            access: true,
            user: {
                name: user.name,
                email: user.email,
                plan: user.plan
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
});


// ================= SCORE + CHARITY =================
app.post("/score", async (req, res) => {
    try {
        const { email, score } = req.body;

        const newScore = new Score({ email, score });
        await newScore.save();

        // 10% charity rule
        const charityAmount = Number(score) * 0.10;

        console.log("10% goes to charity:", charityAmount);

        await User.findOneAndUpdate(
            { email },
            { $inc: { charityAmount: charityAmount } }
        );

        res.json({
            message: "Score added ✅",
            charityAmount
        });

    } catch (err) {
        res.status(500).json({ message: "Error adding score" });
    }
});


// ================= LAST 5 SCORES =================
app.get("/score/:email", async (req, res) => {
    try {
        const scores = await Score.find({ email: req.params.email })
            .sort({ _id: -1 })
            .limit(5);

        res.json({
            scores: scores.map(s => s.score)
        });

    } catch (err) {
        res.json({ scores: [] });
    }
});


// ================= LEADERBOARD =================
app.get("/leaderboard", async (req, res) => {
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

        res.json({
            leaderboard,
            top3: leaderboard.slice(0, 3)
        });

    } catch (err) {
        res.json({ leaderboard: [], top3: [] });
    }
});


// ================= SERVER =================
app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});