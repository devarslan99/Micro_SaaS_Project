const LoginOTP = require('../models/loginotp');
const User = require('../models/User');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const { DateTime } = require('luxon');
const jwt = require('jsonwebtoken');
const config=require("../config.json")


// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,  
    port: config.SMTP_PORT,  
    secure: false,  
    auth: {
        user: config.EMAIL,            
        pass: config.EMAIL_PASSWORD   
    },
   
});


exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const otpExpiry = DateTime.now().plus({ minutes: 10 }).toJSDate();

        let otpEntry = await LoginOTP.findOne({ email });

        if (!otpEntry) {
            otpEntry = new LoginOTP({ email, otp, otpExpiry });
        } else {
            otpEntry.otp = otp;
            otpEntry.otpExpiry = otpExpiry;
        }

        await otpEntry.save();

        const mailOptions = {
            from: config.EMAIL,
            to: email,
            subject: 'Your OTP for Login',
            text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'OTP sent successfully' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

exports.verifyLoginOTP = async (req, res) => {
    const { email, otp} = req.body;
    

    console.log("Received email:", email);
    console.log("Received OTP:", otp);


    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        const otpEntry = await LoginOTP.findOne({ email });

        if (!otpEntry || otpEntry.otp !== otp || new Date() > otpEntry.otpExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        otpEntry.otp = null;
        otpEntry.otpExpiry = null;
      await otpEntry.save({ validateBeforeSave: false });

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 3600000),
        });

        return res.status(200).json({ message: 'OTP verified successfully, login successful' });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};