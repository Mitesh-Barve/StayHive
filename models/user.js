const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values while keeping the unique constraint
    },
    phone: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    language: {
        type: String,
        default: "English"
    },
    currency: {
        type: String,
        default: "USD"
    },
    theme: {
        type: String,
        default: "light"
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
    notifications: [
        {
            title: String,
            message: String,
            category: String,
            time: { type: Date, default: Date.now },
            read: { type: Boolean, default: false }
        }
    ],
    paymentMethods: [
        {
            type: {
                type: String,
                enum: ['credit', 'debit', 'paypal', 'upi']
            },
            lastFour: String,
            expiry: String,
            provider: String
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);