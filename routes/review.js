const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema1.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Middleware to validate review input
const validateReview = (req, res, next) => {
    console.log("Request Body:", req.body); // Debugging line
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// POST route for adding a new review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    // Check if both rating and comment are available in req.body.review
    console.log(req.body); // Debugging line: Log the body to check the structure

    const newReview = new Review({
        rating: req.body.review.rating,
        text: req.body.review.comment // Ensure you're accessing the comment correctly
    });

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));


// DELETE route for removing a review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

module.exports = router;
