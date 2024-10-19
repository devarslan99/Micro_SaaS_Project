const { makeSmartleadApiRequest } = require('../utils/smartleadApiManager'); // Import the request manager
const Email = require('../models/Email'); // MongoDB Email model

const updateSetMaxDay = async (req, res) => {
  const apiKey = req.body.apiKey; 
  const emailAccountId = Number(req.body.email_account_id); // Ensure it's a number
  const maxPerDay = req.body.max_email_per_day;

  console.log('Email Account ID:', emailAccountId);
  console.log('Max Emails Per Day:', maxPerDay);

  const url = `https://server.smartlead.ai/api/v1/email-accounts/${emailAccountId}?api_key=${apiKey}`;
  const payload = {
    max_email_per_day: maxPerDay,
    custom_tracking_url: '""',
    bcc: 'hello@smartlead.com',
    signature: 'Thanks,</br>Ramesh Kumar M',
    time_to_wait_in_mins: 3,
  };

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: payload,
  };

  try {
    // Make the API call using the centralized request manager
    const response = await makeSmartleadApiRequest(url, options);

    console.log('Response from Smartlead:', response);

    // Update the MongoDB Email record after a successful API call
    const updatedEmail = await Email.findOneAndUpdate(
      { email_account_id: emailAccountId }, // Find by email account ID
      { message_per_day: maxPerDay }, // Update the max_email_per_day field
      { new: true } // Return the updated document
    );

    if (updatedEmail) {
      console.log('Email account updated in MongoDB:', updatedEmail);
      res.status(200).json({
        message: 'Email account updated successfully',
        updatedAccount: updatedEmail,
      });
    } else {
      console.log('Email account not found in MongoDB.');
      res.status(404).json({ message: 'Email account not found in MongoDB' });
    }
  } catch (error) {
    console.error('Error updating email account:', error.message);
    res.status(500).json({
      error: 'Failed to update email account',
      details: error.message,
    });
  }
};

module.exports = {
  updateSetMaxDay,
};
