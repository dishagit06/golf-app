const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://dishajais246_db_user:acQRu7zxig9KsERS@cluster0.3mfzexz.mongodb.net/golfdb?retryWrites=true&w=majority&appName=Cluster0"
        );

        console.log("MongoDB Connected ✅");
    } catch (err) {
        console.log("DB Error ❌", err);
    }
};


module.exports = connectDB;