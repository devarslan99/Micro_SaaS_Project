const jwt = require('jsonwebtoken');
const config = require('./../config.json')

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  console.log("autheMiddleware.js:7",token);
  

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('autheMiddleware.js:16-decoded-->',decoded);
    req.body.user = decoded.user;
    console.log('autheMiddleware.js:17 , Moving to Add-API-KEY');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
