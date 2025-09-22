const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const Invoice = require("../models/invoice.js");

// Sample bookings data
const sampleBookings = [
  {
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    guests: 2,
    totalPrice: 1500,
    status: "confirmed"
  },
  {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    guests: 4,
    totalPrice: 3200,
    status: "checked-out"
  },
  {
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    guests: 3,
    totalPrice: 2100,
    status: "cancelled"
  }
];

// Sample invoices data
const sampleInvoices = [
  {
    amount: 1500,
    status: "paid",
    paymentMethod: "Credit Card"
  },
  {
    amount: 3200,
    status: "paid",
    paymentMethod: "PayPal"
  },
  {
    amount: 2100,
    status: "refunded",
    paymentMethod: "Credit Card"
  }
];

async function initSampleData() {
  try {
    // Clear existing bookings and invoices
    await Booking.deleteMany({});
    await Invoice.deleteMany({});
    
    // Get sample users and listings
    const users = await User.find({});
    const listings = await Listing.find({});
    
    if (users.length === 0 || listings.length === 0) {
      console.log("No users or listings found. Please initialize the database first.");
      return;
    }
    
    // Create sample bookings
    for (let i = 0; i < Math.min(sampleBookings.length, listings.length); i++) {
      const booking = new Booking({
        ...sampleBookings[i],
        listing: listings[i]._id,
        user: users[0]._id // Assign to first user
      });
      
      await booking.save();
      
      // Create corresponding invoice
      const invoice = new Invoice({
        ...sampleInvoices[i],
        booking: booking._id,
        user: users[0]._id
      });
      
      await invoice.save();
      
      console.log(`Created booking ${booking._id} and invoice ${invoice.invoiceNumber}`);
    }
    
    console.log("Sample bookings and invoices created successfully!");
  } catch (err) {
    console.error("Error creating sample data:", err);
  }
}

module.exports = { initSampleData };