const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('./../config.json');
  
// Generate a token using user information

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:5173/' // Redirect to the frontend home or login page on failure
}), (req, res) => {
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, config.JWT_SECRET, { expiresIn: '1h' });
  console.log(token)
  res.cookie('google_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now() + 3600000), // Expire the token after 1 hour
  });
  res.redirect('http://localhost:5173/home'); 
});
module.exports = router; 