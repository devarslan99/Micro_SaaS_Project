const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config=require('../config.json')
// Configure Passport to use Google strategy
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Find or create user in your database
  return done(null, profile);
}));

// Serialize user ID to session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});