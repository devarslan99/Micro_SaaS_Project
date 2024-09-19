const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('./../config.json');
const User = require('../models/User'); // Adjust path to your User model

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:5173/' // Redirect to the frontend home or login page on failure
}), async (req, res) => {
  try {
    // Check if user already exists in the database
    let user = await User.findOne({ email: req.user.email });

    // If user does not exist, create a new user
    if (!user) {
      user = new User({
        name: req.user.name,
        email: req.user.email,
        password: 'google_oauth', // You can set a default value or handle password differently
      });
      await user.save();
    }

    // Generate JWT token with 10 years expiration
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: '10y' },
      (err, token) => {
        if (err) throw err;
        // Send token in response to store it in localStorage on the client-side
        res.redirect(`http://localhost:5173/authsetter?token=${token}`);
      }
    );
  } catch (error) {
    console.error('Error during authentication callback:', error);
    res.redirect('http://localhost:5173/'); // Redirect to an error page or handle error accordingly
  }
});

module.exports = router;
