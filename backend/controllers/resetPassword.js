const User = require('../models/User.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config.json')

exports.resetPassword = function (req, res) {
  const token = req.body.token;
  const password = req.body.password;

  // Validate input
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  // Verify the token
  let decoded;
  try {
    decoded = jwt.verify(token, config.JWT_SECRET); // Replace with your JWT secret
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const userId = decoded.userId;

  // Check if user exists
  User.findById(userId)
    .then(function (user) {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      bcryptjs.hash(password, 10)
        .then(function (hashedPassword) {
          // Update the user's password
          user.password = hashedPassword;
          return user.save();
        })
        .then(function () {
          return res.status(200).json({ message: 'Password updated successfully' });
        })
        .catch(function (error) {
          console.error('Error saving user:', error); // Add logging for debugging
          return res.status(500).json({ message: 'Internal server error' });
        });
    })
    .catch(function (error) {
      console.error('Error finding user:', error); // Add logging for debugging
      return res.status(500).json({ message: 'Internal server error' });
    });
};
