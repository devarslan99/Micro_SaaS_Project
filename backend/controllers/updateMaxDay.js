const axios = require('axios');
const Email=require('../models/Email')

const updateSetMaxDay = async (req,res) => {
    const axios = require('axios');

    const apiKey =req.body.apiKey; // Replace with your actual API key
    const emailAccountId = req.body.email_account_id; // Replace with the actual email account ID
    const client_id=req.body.client_id;
    const payload = {
      max_email_per_day: req.body.max_email_per_day,
      custom_tracking_url: '""',
      bcc: 'hello@smartlead.com',
      signature: 'Thanks,</br>Ramesh Kumar M',
      client_id: client_id,
      time_to_wait_in_mins: 3
    };
    
    axios.post(`https://server.smartlead.ai/api/v1/email-accounts/${emailAccountId}?api_key=${apiKey}`, payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Response from Smartlead:', response.data);

        // After successful API call, update max_email_per_day in the MongoDB collection
        return Email.findOneAndUpdate(
          { email_account_id: emailAccountId }, // Find email account by its ID
          { message_per_day: req.body.max_email_per_day }, // Update the max_email_per_day field
          { new: true } // Return the updated document
        );
      })
      .then(updatedEmail => {
        if (updatedEmail) {
          console.log('Email account updated in MongoDB:', updatedEmail);
        } else {
          console.log('Email account not found in MongoDB.');
        }
      })
      .catch(error => {
        console.error(error.message); // Log the error response for debugging
      });
    
};

module.exports = {
  updateSetMaxDay
};
