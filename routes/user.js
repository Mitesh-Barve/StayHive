const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
let { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");

// Middleware function
function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

router.route("/signup")
    .get(usercontroller.rendersignUpForm)
    .post(wrapAsync(usercontroller.signUpUser))

router.route("/login")
    .get( usercontroller.renderloginForm)
    .post(
         saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        usercontroller.login
    )

router.get("/logout", usercontroller.logout);

// Google OAuth routes
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      req.flash("success", "Welcome to StayHive via Google!");
      res.redirect("/listings");
    }
  );

// Profile routes
router.route("/profile")
    .get(isLoggedIn, usercontroller.renderProfile)

router.route("/profile/edit")
    .get(isLoggedIn, usercontroller.renderEditProfile)
    .post(isLoggedIn, usercontroller.updateProfile);

// Payment methods routes
router.route("/payment-methods")
    .get(isLoggedIn, usercontroller.renderPaymentMethods)

// Wishlist routes
router.route("/wishlist")
    .get(isLoggedIn, usercontroller.renderWishlist)

router.post("/wishlist/:id", isLoggedIn, usercontroller.addToWishlist);
router.delete("/wishlist/:id", isLoggedIn, usercontroller.removeFromWishlist);

// Notifications routes
router.route("/notifications")
    .get(isLoggedIn, usercontroller.renderNotifications)

router.post("/notifications/:id/read", isLoggedIn, usercontroller.markNotificationAsRead);

// Settings routes
router.route("/settings")
    .get(isLoggedIn, usercontroller.renderSettings)
    .post(isLoggedIn, usercontroller.updateSettings);

// Bookings routes
router.route("/bookings")
    .get(isLoggedIn, usercontroller.renderBookings)

router.route("/bookings/upcoming")
    .get(isLoggedIn, usercontroller.renderUpcomingTrips)

router.route("/bookings/past")
    .get(isLoggedIn, usercontroller.renderPastTrips)

router.route("/bookings/cancelled")
    .get(isLoggedIn, usercontroller.renderCancelledTrips)

router.post("/bookings/:id/cancel", isLoggedIn, usercontroller.cancelBooking);

// Invoices routes
router.route("/invoices")
    .get(isLoggedIn, usercontroller.renderInvoices)

// Support routes
router.route("/support")
    .get(isLoggedIn, usercontroller.renderSupport)
    .post(isLoggedIn, usercontroller.submitSupportTicket);

module.exports = router;