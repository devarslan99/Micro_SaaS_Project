const express = require('express');
const { checkSoftware, addApiKey, getUserStats } = require('../controllers/softwareController');
const auth = require('../middleware/authMiddleware');
// const { reconnectFailedEmailAccounts } = require('../controllers/reconnectFailed');

const router = express.Router();

// Route to check if user has an API key for selected software
router.post('/check-software',auth, checkSoftware);



// Route to add API key for selected software
router.post('/add-api-key',auth, addApiKey);

// router.post('/reconnect-failed-email',auth,reconnectFailedEmailAccounts);



module.exports = router;
