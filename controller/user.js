const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Invoice = require("../models/invoice");

// Helper function to add notifications
async function addNotification(userId, title, message, category) {
    try {
        const user = await User.findById(userId);
        user.notifications.push({
            title,
            message,
            category,
            time: new Date(),
            read: false
        });
        await user.save();
    } catch (err) {
        console.error("Error adding notification:", err);
    }
}

module.exports.rendersignUpForm = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signUpUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        // Check if username or email already exists
        let existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            // If user exists, log them in
            req.login(existingUser, function (err) {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome back to StayHive");
                res.redirect("/listings"); // Redirect to listings page
            });
        } else {
            // If user doesn't exist, create a new one
            let newUser = new User({
                username,
                email,
            });

            // Register the new user
            await User.register(newUser, password);

            // Add welcome notification
            await addNotification(
                newUser._id,
                "Welcome to StayHive!",
                "Your account has been successfully created. Start exploring listings now!",
                "Account"
            );

            // Log the new user in after registration
            req.login(newUser, function (err) {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to StayHive");
                res.redirect("/listings"); // Redirect to listings page
            });
        }
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup"); // Redirect to signup page if an error occurs
    }
};

module.exports.renderloginForm = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = async (req, res) => {
    // Add login notification
    await addNotification(
        req.user._id,
        "Login Successful",
        "You have successfully logged in to your StayHive account.",
        "Security"
    );
    
    req.flash("success", "Welcome back to StayHive");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = async (req, res, next) => {
    // Add logout notification
    await addNotification(
        req.user._id,
        "Logout Successful",
        "You have successfully logged out of your StayHive account.",
        "Security"
    );
    
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logout Successfully");
        res.redirect("/listings");
    });
}

module.exports.renderProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render("user/profile.ejs", { user });
    } catch (e) {
        req.flash("error", "Error loading profile");
        res.redirect("/listings");
    }
}

module.exports.renderEditProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render("user/edit-profile.ejs", { user });
    } catch (e) {
        req.flash("error", "Error loading profile edit page");
        res.redirect("/user/profile");
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const { username, email, phone, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { username, email, phone, bio },
            { new: true, runValidators: true }
        );
        
        // Add profile update notification
        await addNotification(
            req.user._id,
            "Profile Updated",
            "Your profile information has been successfully updated.",
            "Account"
        );
        
        req.flash("success", "Profile updated successfully");
        res.redirect("/user/profile");
    } catch (e) {
        req.flash("error", "Error updating profile");
        res.redirect("/user/profile/edit");
    }
}

module.exports.renderPaymentMethods = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('paymentMethods');
        res.render("user/payment-methods.ejs", { user });
    } catch (e) {
        req.flash("error", "Error loading payment methods");
        res.redirect("/user/profile");
    }
}

module.exports.renderWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.render("user/wishlist.ejs", { user, listings: user.wishlist });
    } catch (e) {
        req.flash("error", "Error loading wishlist");
        res.redirect("/user/profile");
    }
}

module.exports.addToWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        const listing = await Listing.findById(id);
        
        if (!user.wishlist.includes(id)) {
            user.wishlist.push(id);
            await user.save();
            
            // Add wishlist notification
            await addNotification(
                req.user._id,
                "Added to Wishlist",
                `You've added "${listing.title}" to your wishlist.`,
                "Wishlist"
            );
            
            req.flash("success", "Added to wishlist");
        } else {
            req.flash("error", "Already in wishlist");
        }
        res.redirect(`/listings/${id}`);
    } catch (e) {
        req.flash("error", "Error adding to wishlist");
        res.redirect("/listings");
    }
}

module.exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { wishlist: id } },
            { new: true }
        );
        
        // Add wishlist removal notification
        const listing = await Listing.findById(id);
        await addNotification(
            req.user._id,
            "Removed from Wishlist",
            `You've removed "${listing.title}" from your wishlist.`,
            "Wishlist"
        );
        
        req.flash("success", "Removed from wishlist");
        res.redirect("/user/wishlist");
    } catch (e) {
        req.flash("error", "Error removing from wishlist");
        res.redirect("/user/wishlist");
    }
}

module.exports.renderNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render("user/notifications.ejs", { user, notifications: user.notifications });
    } catch (e) {
        req.flash("error", "Error loading notifications");
        res.redirect("/user/profile");
    }
}

module.exports.markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        const notification = user.notifications.id(id);
        if (notification) {
            notification.read = true;
            await user.save();
        }
        res.redirect("/user/notifications");
    } catch (e) {
        req.flash("error", "Error marking notification as read");
        res.redirect("/user/notifications");
    }
}

module.exports.renderSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render("user/settings.ejs", { user });
    } catch (e) {
        req.flash("error", "Error loading settings");
        res.redirect("/user/profile");
    }
}

module.exports.updateSettings = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword, language, currency, theme } = req.body;
        const user = await User.findById(req.user._id);
        
        // Update preferences
        user.language = language;
        user.currency = currency;
        user.theme = theme;
        
        // Handle password change if provided
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                req.flash("error", "New passwords do not match");
                return res.redirect("/user/settings");
            }
            
            // Change password
            await user.changePassword(currentPassword, newPassword);
            
            // Add password change notification
            await addNotification(
                req.user._id,
                "Password Changed",
                "Your password has been successfully updated.",
                "Security"
            );
        }
        
        await user.save();
        
        // Add settings update notification
        await addNotification(
            req.user._id,
            "Settings Updated",
            "Your account settings have been successfully updated.",
            "Account"
        );
        
        req.flash("success", "Settings updated successfully");
        res.redirect("/user/profile");
    } catch (e) {
        req.flash("error", "Error updating settings: " + e.message);
        res.redirect("/user/settings");
    }
}

module.exports.renderBookings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookings = await Booking.find({ user: user._id })
            .populate('listing')
            .sort({ bookingDate: -1 });
        res.render("user/bookings.ejs", { user, bookings });
    } catch (e) {
        req.flash("error", "Error loading bookings");
        res.redirect("/user/profile");
    }
}

module.exports.renderUpcomingTrips = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const today = new Date();
        const bookings = await Booking.find({ 
            user: user._id,
            startDate: { $gte: today },
            status: { $ne: 'cancelled' }
        })
        .populate('listing')
        .sort({ startDate: 1 });
        res.render("user/upcoming-trips.ejs", { user, bookings });
    } catch (e) {
        req.flash("error", "Error loading upcoming trips");
        res.redirect("/user/bookings");
    }
}

module.exports.renderPastTrips = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const today = new Date();
        const bookings = await Booking.find({ 
            user: user._id,
            $or: [
                { endDate: { $lt: today } },
                { status: 'checked-out' }
            ]
        })
        .populate('listing')
        .sort({ endDate: -1 });
        res.render("user/past-trips.ejs", { user, bookings });
    } catch (e) {
        req.flash("error", "Error loading past trips");
        res.redirect("/user/bookings");
    }
}

module.exports.renderCancelledTrips = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookings = await Booking.find({ 
            user: user._id,
            status: 'cancelled'
        })
        .populate('listing')
        .sort({ bookingDate: -1 });
        res.render("user/cancelled-trips.ejs", { user, bookings });
    } catch (e) {
        req.flash("error", "Error loading cancelled trips");
        res.redirect("/user/bookings");
    }
}

module.exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('listing');
        
        if (booking.user.toString() !== req.user._id.toString()) {
            req.flash("error", "You don't have permission to cancel this booking");
            return res.redirect("/user/bookings");
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        // Add booking cancellation notification
        await addNotification(
            req.user._id,
            "Booking Cancelled",
            `Your booking for "${booking.listing.title}" has been cancelled.`,
            "Booking"
        );
        
        req.flash("success", "Booking cancelled successfully");
        res.redirect("/user/bookings");
    } catch (e) {
        req.flash("error", "Error cancelling booking");
        res.redirect("/user/bookings");
    }
}

module.exports.renderInvoices = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const invoices = await Invoice.find({ user: user._id })
            .populate('booking')
            .sort({ date: -1 });
        res.render("user/invoices.ejs", { user, invoices });
    } catch (e) {
        req.flash("error", "Error loading invoices");
        res.redirect("/user/profile");
    }
}

module.exports.renderSupport = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render("user/support.ejs", { user });
    } catch (e) {
        req.flash("error", "Error loading support page");
        res.redirect("/user/profile");
    }
}

module.exports.submitSupportTicket = async (req, res) => {
    try {
        // In a real implementation, this would save the support ticket to the database
        // Add support ticket notification
        await addNotification(
            req.user._id,
            "Support Ticket Submitted",
            "Your support ticket has been submitted. Our team will get back to you soon.",
            "Support"
        );
        
        req.flash("success", "Support ticket submitted successfully. We'll get back to you soon.");
        res.redirect("/user/support");
    } catch (e) {
        req.flash("error", "Error submitting support ticket");
        res.redirect("/user/support");
    }
}