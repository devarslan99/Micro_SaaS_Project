const express = require('express')
const router = express.Router()


router.get('/client-emails',async (req , res)=>{
const { clientId} = req.body
console.log('Request Recieved to /client-emails');
console.log(clientId);
const Email = require('../models/Email')

try {
    const emails = await Email.find(
        { client_id: clientId }, // Match documents with the specific client_id
        {
            from_email: 1,                     // Include the 'from_email' field
            "warmup_details.status": 1,         // Include 'warmup_details.status'
            "warmup_details.warmup_reputation": 1, // Include 'warmup_details.warmup_reputation'
            message_per_day: 1,                 // Include 'message_per_day'
            daily_sent_count: 1                 // Include 'daily_sent_count'
        }
    );

    // Log or return the results
    console.log("Email List: ", emails);
   res.status(200).json(emails)
} catch (error) {
    console.error("Error fetching email list: ", error);
    throw error;
}

})

module.exports = router;