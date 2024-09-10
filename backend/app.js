require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const otpRoutes = require('./routes/otpRouter');
require('./config/passport');
const connectDB = require('./config/db');
const auth=require('./routes/auth');
const oauth=require("./routes/oauth")
const softwareRoutes = require('./routes/software');
const resetPassRouter=require('./routes/resetPass')
const userUpdateRoute=require('./routes/updateUser')
const config=require('./config.json')
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(session({
  secret: config.KEY,
  resave: false,
  saveUninitialized: true
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session())
app.use(cors());
//auth  Routes
app.use('/api/auth',auth);
app.use('/', oauth);
////Api and software routes
app.use('/api/software', softwareRoutes);
// otp routes
app.use('/api/otp', otpRoutes);
app.use('/',resetPassRouter)
app.use('/',userUpdateRoute)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));