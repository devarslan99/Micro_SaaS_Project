const jwt = require('jsonwebtoken');
const config = require('./../config.json')

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  console.log("token",token);
  

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
