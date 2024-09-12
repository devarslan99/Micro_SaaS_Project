const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config=require('../config.json')
const oauth=require('../models/oauth')
const jwt = require('jsonwebtoken');

// Configure Passport to use Google strategy
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Generate a JWT token
  const token = jwt.sign(
    { id: profile.id, email: profile.emails[0].value },
    config.JWT_SECRET,
    { expiresIn: '1h' }
  );
    // Check if the user already exists in the database
    let user = await oauth.findOne({ googleId: profile.id });
    if (!user) {
      // If the user doesn't exist, create a new one
      user = new oauth({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
  return done(null, profile);
}));
// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});