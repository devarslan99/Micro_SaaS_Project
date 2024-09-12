const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const express = require('express')
const router = express.Router()

router.get('/clients', async (req, res) => {
  const softwareToken = req.header('softwareToken');

    console.log("software client", softwareToken)
  
    if (!softwareToken) {
      return res.status(400).json({ message: 'Software token is required' });
    }
  
    try {
      // Decode the token to get software information
      const decoded = jwt.verify(softwareToken, config.JWT_SECRET);
      const softwareName = decoded.software;

      console.log("software name",softwareName)
  
      if (!softwareName) {
        return res.status(404).json({ message: 'Software not found' });
      }
  
      // Find clients based on software name
      const clients = await Client.find({ software: softwareName });
  
      res.status(200).json(clients);
    } catch (err) {
      console.error('Error fetching clients:', err.message);
      res.status(500).json({ message: 'Failed to fetch clients', error: err.message });
    }
  });


  module.exports = router;


// In your controller: