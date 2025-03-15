const mongoose = require("mongoose");
const User = require("../models/user");

const mongo_url = "mongodb://127.0.0.1:27017/dhruv";

async function createAdmin() {
    try {
        await mongoose.connect(mongo_url);
        console.log("Connected to DB");

        const admin = new User({ username: "janu", email: "janu@me.com", isAdmin: true });
        await User.register(admin, "janu");
        console.log("Admin user created with username 'janu' and email 'janu@me.com'");
    } catch (err) {
        console.log("Error creating admin user:", err);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin(); 