const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
let { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js"); // Fixed the function name
let ReviewController = require("../controller/reviews.js");

// Server side validation
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); // Fixed error message
    } else {
        next();
    }
}

// For Review Model
// Create review / Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));

// Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.deleteReview));

module.exports = router;