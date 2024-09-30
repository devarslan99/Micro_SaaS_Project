const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register route with validation
router.post('/register', validateSignup, registerUser);

// Login route with validation
router.post('/login', loginUser);
router.post('/change-password', authMiddleware,changePassword);

module.exports = router;
