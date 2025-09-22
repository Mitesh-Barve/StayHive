const { ref, string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const Review = require("./review.js");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true // Fixed typo: was "require"
        },
        description: {
            type: String,
            required: true // Fixed typo: was "require"
        },
        image: {
            url: String,
            filename: String,
        },
        price: {
            type: Number,
            required: true // Fixed typo: was "require"
        },
        location: {
            type: String,
            required: true // Fixed typo: was "require"
        },
        country: {
            type: String,
            required: true // Fixed typo: was "require"
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        // Removed geometry field as map functionality is no longer needed
        category: {
            type: String,
        },
    }
);

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema); // Fixed naming convention

module.exports = Listing;