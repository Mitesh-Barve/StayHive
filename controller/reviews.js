const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); // Fixed naming convention

module.exports.createReview = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        
        await newReview.save();
        await listing.save();
        
        req.flash("success", "Review created");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error creating review");
        res.redirect(`/listings/${req.params.id}`);
    }
}

module.exports.deleteReview = async (req, res) => {
    try {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error deleting review");
        res.redirect(`/listings/${id}`);
    }
}