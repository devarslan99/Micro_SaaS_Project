const express = require('express');
const router = express.Router();
const {resetPassword} = require('../controllers/resetPassword');
const {sendPasswordResetEmail} = require('../controllers/resetPasswordMail')

router.post('/mail', sendPasswordResetEmail);
router.post('/password', resetPassword);

module.exports = router;