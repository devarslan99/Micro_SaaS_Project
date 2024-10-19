
// const axios = require('axios');
const { makeSmartleadApiRequest } = require('../utils/smartleadApiManager'); // Use centralized request manager


exports.reconnetEmails = async function(req, res){
    const apiKey = req.body.apiKey; // Replace with your actual API key
  console.log(apiKey);
  const url = `https://server.smartlead.ai/api/v1/email-accounts/reconnect-failed-email-accounts?api_key=${apiKey}`;
  const options = {
    method: 'POST',
    headers: { accept: 'application/json' },
  };
    try {
      const data = await makeSmartleadApiRequest(url, options);

      console.log('Reconnect Failed Email Accounts Response:', data);
  
      res.status(200).json({ message: 'Reconnected failed email accounts successfully.', data });
    } catch (error) {
      console.error('Error reconnecting failed email accounts:', error.message);
      res.status(500).json({ error: 'Failed to reconnect failed email accounts.' });
    }
  };
