require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
const connectDB = require('./config/db');
const auth=require('./routes/auth');
const oauth=require("./routes/oauth")
const softwareRoutes = require('./routes/software');
const resetPassRouter=require('./routes/resetPass')
const userUpdateRoute=require('./routes/updateUser')
const clientsRouter = require('./routes/clients.js')
const campaighsRoutes = require('./routes/campaigh.route.js')
const emailRoutes = require('./routes/email.route.js')
const refreshRoute = require('./routes/refreshRoute.route.js')
const paymentRote = require('./routes/payment.js')
const config=require('./config.json')
const app = express();
const cors = require('cors')
// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors({
  origin:'*'
}))
// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: config.KEY,
  resave: false,
  saveUninitialized: true
}));
app.get('/',(req,res)=>{
    console.log('test')
    res.send("Working Fine")
})
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session())
//auth  Routes
app.use('/api/auth',auth);
app.use('/', oauth);
////Api and software routes
app.use('/api/software', softwareRoutes);
//Api For Campaigh Details
app.use('/api/campaighs',campaighsRoutes)
//Api for Emails 
app.use('/api/email',emailRoutes)
// otp routes
app.use('/reset',resetPassRouter)
app.use('/user',userUpdateRoute)
app.use('/', clientsRouter)
app.use('/payment',paymentRote )
//Refresh Routes
app.use('/refresh',refreshRoute)
//Refresh Button Route
// app.get('/refreshData', authMiddleware,refreshData)
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
