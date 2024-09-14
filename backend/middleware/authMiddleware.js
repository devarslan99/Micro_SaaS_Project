const jwt = require('jsonwebtoken');
const config = require('./../config.json')
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  const software = req.body.software;
  console.log(software);
  console.log(req.body.apiKey);
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  if(req.body.apiKey){
  console.log("autheMiddleware.js:7",token);
  const decoded = jwt.verify(token, config.JWT_SECRET);
  console.log('autheMiddleware.js:16-decoded-->',decoded);
  req.body.user = decoded.user;
    console.log('autheMiddleware.js:17 , Moving to Next Middleware');
    next();
  }

  // try {
  //   const decoded = jwt.verify(token, config.JWT_SECRET);
  //   console.log('autheMiddleware.js:16-decoded-->',decoded);
  //   req.body.user = decoded.user;
  //   const user = await User.findById(req.body.user.id);
  //   const softwareData =user.softwareKeys.find(
  //     (item) => item.software === software
  //   );
  //     req.body.apiKey= softwareData.apiKey
  //   console.log('autheMiddleware.js:17 , Moving to Next Middleware');
  //   // next();
  // } catch (err) {
  //   res.status(401).json({ msg: 'Token is not valid' });
  // }
};

module.exports = authMiddleware;
