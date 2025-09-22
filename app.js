if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const listings = require("./models/listing.js");

const ListingRouter = require("./routes/listing.js");
const categoryRouter=require("./routes/category.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user.js");

app.use(methodoverride("_method"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // Fixed typo: was "viewengine"

app.use(express.urlencoded({ extended: true })); // Fixed typo: was "extends"
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOption = {
  secret: process.env.SESSION_SECRET || "mysupersecrtecode", // Use env variable
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username:
              profile.displayName || profile.emails[0].value.split("@")[0],
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Main route
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use("/listings", ListingRouter);
app.use("/listings/:id", reviewRouter);
app.use("/", userRouter);
app.use("/",categoryRouter);
app.use("/search",searchRouter);

// Connect to database and check if we need to initialize with sample data
main()
  .then(async () => {
    console.log("Successfully connected");
    // Check if we need to initialize the database with sample data
    const Listing = require("./models/listing.js");
    const count = await Listing.countDocuments();
    if (count === 0) {
      console.log("Initializing database with sample data...");
      const { initDB } = require("./init/index.js");
      await initDB();
      console.log("Database initialized with sample data");
    }
  })
  .catch((err) => console.log(err));

async function main() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stayhive";
  await mongoose.connect(mongoUri);
}

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 404, message = "Page Not Found" } = err; // Fixed typo: was "page Not Found"
  res.status(statusCode).render("error.ejs", { message });
});

// Use PORT from environment variables
app.listen(process.env.PORT || 3000, () => { // Fixed: was missing callback parameter
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});