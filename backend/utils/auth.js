import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/UserModel.js";

export const initializePassport = (passport) => {
  // Local Strategy for username/password authentication
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "No user found with that email." });
          }

          const isValidPassword = await bcrypt.compare(password, user.password);
          if (isValidPassword) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect." });
          }
        } catch (err) {
          console.error("Error during local authentication:", err);
          done(err);
        }
      }
    )
  );

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            return done(null, user);
          }

          // Create new user if doesn't exist
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "google-auth", // Placeholder password for Google users
            contactNumber: "N/A", // Google doesn't provide phone number
            profilePic: profile.photos[0]?.value || "default.jpg",
          });

          await user.save();
          return done(null, user);
        } catch (error) {
          console.error("Error in Google OAuth:", error);
          return done(error, null);
        }
      }
    )
  );

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}; 