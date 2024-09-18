const jwt = require('jsonwebtoken');
const config = require('./../config.json')
const User = require('../models/User');

const addApiMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Auth Token', token);
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
  const user = decoded.user
  req.body.user = user;
  const softwareData =user.softwareKeys.find(
    (item) => item.apiKey === req.body.api
  )
    if(softwareData) res.status(200).json("Api Key Already Exist")
    console.log('autheMiddleware.js:17 , Moving to Next Middleware');
   return next();
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('autheMiddleware.js:29-decoded-->',decoded);
    req.body.user = decoded.user;
    const decodeSoftwareToken = jwt.verify(SoftwareToken, config.JWT_SECRET);
    console.log('autheMiddleware.js:32-Softwaredecoded-->',decodeSoftwareToken);
    const user = await User.findById(req.body.user.id);
    console.log('User DB', user);
    const softwareData =user.softwareKeys.find(
      (item) => item.apiKey === req.body.api
    )
    console.log(softwareData);
      req.body.apiKey= softwareData.apiKey
      req.body.software = softwareData.software
      console.log('Api key after Setting',req.body.apiKey);
      console.log('Software Name after Setting',req.body.software);
    console.log('autheMiddleware.js:41 , Moving to Next Middleware');
    return next();
  } catch (err) {
    res.status(402).json({ msg: 'Token is not valid' });
  }
};

module.exports = addApiMiddleware;
