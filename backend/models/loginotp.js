const mongoose = require('mongoose')

const loginOtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpiry: { type: Date }
});

const LoginOTP = mongoose.model('LoginOTP', loginOtpSchema);

module.exports=LoginOTP;