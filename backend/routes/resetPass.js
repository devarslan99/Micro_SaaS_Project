const express = require('express');
const router = express.Router();
const {resetPassword} = require('../controllers/resetPassword');
const {sendPasswordResetEmail} = require('../controllers/resetPasswordMail')

router.get('/mail', sendPasswordResetEmail);
router.post('/reset-password', resetPassword);

module.exports = router;