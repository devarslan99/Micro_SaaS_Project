const { check, validationResult } = require('express-validator');

// Middleware for handling validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Signup Validation Middleware
const validateSignup = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  handleValidationErrors,
];

// Login Validation Middleware
const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  handleValidationErrors,
];

module.exports = {
  validateSignup,
  validateLogin,
};
