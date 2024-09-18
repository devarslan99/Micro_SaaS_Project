const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const config = require('./../config.json');
const bcryptjs = require('bcryptjs');

exports.sendPasswordResetEmail = function (req, res) {
  const email = req.body.email;
    console.log('Sending Mail to the user');
  // Validate input
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Check if user exists
  User.findOne({ email: email })
    .then(function (user) {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate a reset token (JWT or random string)
      const token = jwt.sign(
        { userId: user._id },
        config.JWT_SECRET, // Use a secret key from .env file
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Create a URL with the token that redirects to your frontend
      const resetUrl = `http://localhost:5173/reset-password/?token=${token}`;

      // Set up the email transporter (use Gmail or any SMTP service)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'j44451666@gmail.com', // Your email address
          pass: 'xhgr hupq naqd yhwm', // Your email password or app password
        },
      });

      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetUrl}">Reset Password</a>
               <p>If you did not request this, please ignore this email.</p>`,
      };

      // Send the email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending email' });
        }
        return res.status(200).json({ message: 'Password reset email sent successfully' });
      });
    })
    .catch(function (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    });
};
