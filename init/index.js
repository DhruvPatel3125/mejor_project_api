const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/dhruv";

// Main function to connect to the database
async function main() {
  try {
    await mongoose.connect(mongo_url);
    console.log("Connected to DB");
    await initDB();  // Call initDB after the DB connection is successful
  } catch (err) {
    console.log("Error connecting to DB:", err);
  }
}

// Function to initialize data
const initDB = async () => {
  try {
    // Delete all existing listings
    await Listing.deleteMany({});
    // Insert the data from initData into the database
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.log("Error initializing data:", err);
  }
};

// Call the main function to start the process
main();
