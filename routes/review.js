const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema1.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedin } = require("../middleware.js");

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
router.post("/", isLoggedin, validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    
    const newReview = new Review({
        rating: req.body.review.rating,
        comment: req.body.review.comment,
        author: req.user._id // Always set the author
    });
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added");
    
    res.redirect(`/listings/${listing._id}`);
}));


// DELETE route for removing a review
router.delete("/:reviewId", isLoggedin, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
