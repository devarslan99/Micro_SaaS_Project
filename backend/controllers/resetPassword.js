const User = require('../models/User.js');
const bcryptjs = require('bcryptjs');

exports.resetPassword = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user exists
  User.findOne({ email: email })
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