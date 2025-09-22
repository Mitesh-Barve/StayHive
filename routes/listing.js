const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js"); // Add booking model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
let listingController = require("../controller/listing.js"); // Fixed variable name
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// New route
router.get("/new", isLoggedIn, wrapAsync(listingController.rendernewForm));

// Booking route
router.post("/:id/book", isLoggedIn, wrapAsync(listingController.createBooking));

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // Fixed function name
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.rendereditForm));

module.exports = router;