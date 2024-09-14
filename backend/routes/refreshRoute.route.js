
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const { refreshDataEmails } = require('../controllers/refreshDataEmails.js');
const { refreshDataCampaighs } = require('../controllers/refreshDataCampaighs.js')
const router = express.Router()

router.get('/emails',authMiddleware,refreshDataEmails );
router.get('/campaighs',authMiddleware,refreshDataCampaighs );


 module.exports = router;
