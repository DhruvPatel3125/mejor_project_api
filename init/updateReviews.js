const mongoose = require("mongoose");
const Review = require("../models/review");

const mongo_url = "mongodb://127.0.0.1:27017/dhruv";

async function updateReviews() {
    try {
        await mongoose.connect(mongo_url);
        console.log("Connected to DB");

        // Find reviews without an author
        const reviews = await Review.find({ author: { $exists: false } });
        console.log(`Found ${reviews.length} reviews without an author`);

        // Update each review to have a default author
        for (let review of reviews) {
            review.author = null; // Set to null or a default user ID
            await review.save();
        }

        console.log("Reviews updated successfully");
    } catch (err) {
        console.log("Error updating reviews:", err);
    } finally {
        mongoose.connection.close();
    }
}

updateReviews(); 