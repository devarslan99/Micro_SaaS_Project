const axios = require('axios');
const Email=require('../models/Email')

const updateSetMaxDay = async (req,res) => {
    const axios = require('axios');

    const apiKey =req.body.apiKey; // Replace with your actual API key
    // const emailAccountId = req.body.email_account_id; // Replace with the actual email account ID
    const emailAccountId = req.body.email_account_id;
    const maxPerDay =req.body.max_email_per_day

    console.log('Email ID ', emailAccountId);
    console.log('maxPerDay ', maxPerDay);
    const payload = {
      // max_email_per_day: req.body.max_email_per_day,
      max_email_per_day: maxPerDay,
      custom_tracking_url: '""',
      bcc: 'hello@smartlead.com',
      signature: 'Thanks,</br>Ramesh Kumar M',
      time_to_wait_in_mins: 3
    };
    console.log(emailAccountId);
    axios.post(`https://server.smartlead.ai/api/v1/email-accounts/${Number(emailAccountId)}?api_key=${apiKey}`, payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Response from Smartlead:', response.data);
          console.log(typeof emailAccountId);
        // After successful API call, update max_email_per_day in the MongoDB collection
        return Email.findOneAndUpdate(
          { email_account_id: Number(emailAccountId) }, // Find email account by its ID
          { message_per_day: req.body.max_email_per_day }, // Update the max_email_per_day field
          { new: true } // Return the updated document
        );
      })
      .then(updatedEmail => {
        if (updatedEmail) {
          console.log('Email account updated in MongoDB:', updatedEmail);
          res.status(200).json({
            message:"Email account updated",
            updateAccount:updatedEmail
          })
        } else {
          console.log('Email account not found in MongoDB.');
        }
      })
      .catch(error => {
        console.error(error.response.data); // Log the error response for debugging
      });
    
};

module.exports = {
  updateSetMaxDay
};
