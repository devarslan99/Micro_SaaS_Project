const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

// Register route with validation
router.post('/register', validateSignup, registerUser);

// Login route with validation
router.post('/login', loginUser);

module.exports = router;
