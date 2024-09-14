const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const { refreshDataEmails } = require('../controllers/refreshDataEmails.js');
const router = express.Router()

router.get('/emails',authMiddleware,refreshDataEmails );


 module.exports = router;
