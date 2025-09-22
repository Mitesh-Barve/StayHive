const { query } = require("express");
const Listing = require("../models/listing"); // Fixed naming convention
const Booking = require("../models/booking"); // Add booking model

module.exports.index = async (req, res) => {
    let { category } = req.query;
    
    let query = {};
    if (category && category !== 'trending') {
        // Map category names to search terms
        const categoryMap = {
            'rooms': 'room',
            'iconic cities': 'city',
            'mountains': 'mountain',
            'farms': 'farm',
            'arctic': 'arctic',
            'domes': 'dome',
            'boats': 'boat',
            'beach': 'beach',
            'luxury': 'luxury',
            'camping': 'camp',
            'castles': 'castle'
        };
        
        const searchTerm = categoryMap[category.toLowerCase()];
        if (searchTerm) {
            query = {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { location: { $regex: searchTerm, $options: 'i' } },
                    { country: { $regex: searchTerm, $options: 'i' } }
                ]
            };
        }
    }
    
    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings, category });
}

module.exports.rendernewForm = async (req, res) => {
    res.render("listings/new.ejs"); // Fixed path
};

module.exports.showListing = async (req, res) => { // Fixed function name
    let { id } = req.params;
    // Fixed: Ensure owner is populated properly with the correct path
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate({ path: "owner" });
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings"); // Fixed redirect
    }
    res.render("listings/show.ejs", { listing }); // Fixed path
}

module.exports.rendereditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings"); // Fixed redirect
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150,h_100"); // Fixed typo: was "/uplaod"
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`); // Fixed redirect to show the updated listing
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id); // Removed unnecessary parameter
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}

module.exports.createListing = async (req, res, next) => {
    try {
        // Only proceed if req.file exists
        if (!req.file) {
            req.flash("error", "Image is required");
            return res.redirect("/listings/new");
        }

        // Removed Mapbox geocoding functionality
        
        let url = req.file.path;
        let filename = req.file.filename;

        let newListing = new Listing(req.body.listing); // Fixed variable name
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        // Removed geometry assignment

        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success", "New listing created successfully");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Error creating listing");
        res.redirect("/listings/new");
    }
}

// Add booking functionality
module.exports.createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkin, checkout, guests } = req.body;
        
        // Validate dates
        const startDate = new Date(checkin);
        const endDate = new Date(checkout);
        const today = new Date();
        
        if (startDate < today) {
            req.flash("error", "Check-in date cannot be in the past");
            return res.redirect(`/listings/${id}`);
        }
        
        if (endDate <= startDate) {
            req.flash("error", "Check-out date must be after check-in date");
            return res.redirect(`/listings/${id}`);
        }
        
        // Validate guests
        const guestCount = parseInt(guests);
        if (isNaN(guestCount) || guestCount < 1) {
            req.flash("error", "Please select a valid number of guests");
            return res.redirect(`/listings/${id}`);
        }
        
        // Find the listing
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        // Calculate total price (simplified calculation)
        const timeDiff = endDate.getTime() - startDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalPrice = days * listing.price;
        
        // Create booking
        const booking = new Booking({
            listing: id,
            user: req.user._id,
            startDate,
            endDate,
            guests: guestCount,
            totalPrice
        });
        
        await booking.save();
        
        req.flash("success", "Booking created successfully!");
        res.redirect("/bookings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Error creating booking");
        res.redirect(`/listings/${req.params.id}`);
    }
}