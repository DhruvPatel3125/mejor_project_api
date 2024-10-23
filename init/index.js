const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/dhruv";

async function main() {
    try {
        await mongoose.connect(mongo_url);
        console.log("Connected to DB");

        // Initialize data only after a successful connection
        await initDB();
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Data initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

main();
