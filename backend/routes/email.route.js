const express = require('express')
const router = express.Router()
const { emailUpdate } = require('../controllers/emailUpdate.controller.js')
const {reconnetEmails} = require('../controllers/reconnectEmail.controller.js')
const { updateSetMaxDay } = require('../controllers/updateMaxDay');
const authMiddleware = require('../middleware/authMiddleware.js');


router.get('/client-emails',async (req , res)=>{
const clientId = req.header("clientId") 
console.log('Request Recieved to /client-emails');
console.log(clientId);
const Email = require('../models/Email')
try {
    const emails = await Email.find(
        { client_id: null }, // Match documents with the specific client_id
        {
            from_name:1,
            from_email: 1,                     // Include the 'from_email' field
            message_per_day: 1,                 // Include 'message_per_day'
            daily_sent_count: 1,
            warmupStatus: "$warmup_details.status",         
            warmupReputation: "$warmup_details.warmup_reputation",                  // Include 'daily_sent_count'
            email_account_id:1   
        }
    );

    // Log or return the results
    // console.log("Email List: ", emails);
   res.status(200).json(emails)
} catch (error) {
    console.error("Error fetching email list: ", error);
    throw error;
}

})

router.post('/update-email',emailUpdate)
router.post('/reconnect',authMiddleware,reconnetEmails)
router.post('/max-day',authMiddleware,updateSetMaxDay);

module.exports = router;