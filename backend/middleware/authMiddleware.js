const jwt = require('jsonwebtoken');
const config = require('./../config.json')
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  const SoftwareToken = req.header('SoftwareAuthorization');
  // const software = req.body.software;
  console.log('Software Token',SoftwareToken);
  console.log('Api Key',req.body.apiKey);
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  if(req.body.apiKey){
  console.log("autheMiddleware.js:7",token);
  const decoded = jwt.verify(token, config.JWT_SECRET);
  console.log('autheMiddleware.js:16-decoded-->',decoded);
  const decodeSoftwareToken = jwt.verify(SoftwareToken, config.JWT_SECRET);
  console.log('autheMiddleware.js:29-Softwaredecoded-->',decodeSoftwareToken);
  req.body.user = decoded.user;
  req.body.software = req.body.decodeSoftwareToken.software
    console.log('autheMiddleware.js:17 , Moving to Next Middleware');
    next();
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('autheMiddleware.js:16-decoded-->',decoded);
    req.body.user = decoded.user;
    const decodeSoftwareToken = jwt.verify(token, config.JWT_SECRET);
    console.log('autheMiddleware.js:29-Softwaredecoded-->',decodeSoftwareToken);
    const user = await User.findById(req.body.user.id);
    const softwareData =user.softwareKeys.find(
      (item) => item.software === decodeSoftwareToken.software
    );
      req.body.apiKey= softwareData.apiKey
      req.body.software = req.body.decodeSoftwareToken.software
    console.log('autheMiddleware.js:17 , Moving to Next Middleware');
    // next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
