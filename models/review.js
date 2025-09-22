const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    comment: { // Fixed typo: was "Comment"
        type: String,
        required: true
    },
    rating: {
        type: Number, // Fixed: was String
        min: 1,
        max: 5,
        required: true
    },
    date: { // Fixed naming convention: was "Date"
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Review", ReviewSchema);