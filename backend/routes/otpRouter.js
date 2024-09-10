const express =require('express')
const { sendOTP, verifyLoginOTP } = require('../controllers/otpController.js')

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyLoginOTP);

module.exports =router