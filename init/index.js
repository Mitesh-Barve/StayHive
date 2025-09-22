const mongoose = require("mongoose");
const Listing = require("../models/listing.js"); // Fixed naming convention
const User = require("../models/user.js");
const initData = require("./data.js");
const { initSampleData } = require("./sampleData.js");

// Commented out automatic execution - run manually when needed
// main().then(() => {
//     console.log("Successfully connected to MongoDB");
// }).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stayhive');
}

const initDB = async () => {
    await Listing.deleteMany({});
    await User.deleteMany({});
    
    // Create a default user with the specific ID
    const defaultUser = new User({
        _id: new mongoose.Types.ObjectId("67717c9e34073547bd39ae34"),
        username: "testuser",
        email: "test@example.com"
    });
    
    // Set the password for the user
    await User.register(defaultUser, "password123");
    
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "67717c9e34073547bd39ae34",
    }));

    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
    
    // Initialize sample bookings and invoices
    await initSampleData();
}

// Commented out automatic execution - run manually when needed
// initDB();

module.exports = { initDB, main };