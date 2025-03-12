const mongoose = require("mongoose");
const User = require("../models/user");

const mongo_url = "mongodb://127.0.0.1:27017/dhruv";

async function promoteToAdmin(username) {
    try {
        await mongoose.connect(mongo_url);
        console.log("Connected to DB");

        const user = await User.findOne({ username });
        if (user) {
            user.isAdmin = true;
            await user.save();
            console.log(`User ${username} has been promoted to admin.`);
        } else {
            console.log("User not found.");
        }
    } catch (err) {
        console.log("Error promoting user to admin:", err);
    } finally {
        mongoose.connection.close();
    }
}

// Replace 'your_username' with the actual username you want to promote
promoteToAdmin("dhruv"); 