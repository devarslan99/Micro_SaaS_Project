const axios = require('axios');


const reconnectFailedEmailAccounts = async (req, res) => {
    const apiKey = req.body.apiKey; // Replace with your actual API key
  console.log(apiKey);
    const options = {
      method: 'POST',
      headers: { accept: 'application/json' }
    };
  
    try {
      const response = await fetch(`https://server.smartlead.ai/api/v1/email-accounts/reconnect-failed-email-accounts?api_key=${apiKey}`, options);
      const data = await response.json();
  
      console.log('Reconnect Failed Email Accounts Response:', data);
  
      res.status(200).json({ message: 'Reconnected failed email accounts successfully.', data });
    } catch (error) {
      console.error('Error reconnecting failed email accounts:', error.message);
      res.status(500).json({ error: 'Failed to reconnect failed email accounts.' });
    }
  };


  module.exports = {
    reconnectFailedEmailAccounts
  };