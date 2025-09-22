const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing"); // Fixed naming convention

router.post("/", wrapAsync(async (req, res) => {
    try {
        const searchQuery = req.body.search;
        console.log(searchQuery);

        const results = await Listing.find({ 
            $or: [
                { location: new RegExp(searchQuery, "i") },
                { country: new RegExp(searchQuery, "i") },
                { title: new RegExp(searchQuery, "i") }
            ]
        });
        
        console.log(results);
        res.render("listings/search.ejs", { results, searchQuery }); // Fixed path
    } catch (err) {
        console.error(err);
        req.flash("error", "Error searching listings");
        res.redirect("/listings");
    }
}));

module.exports = router;