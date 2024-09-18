const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateAndFetchClients } = require('../api/smartleadclient');
const { FetchAllCampaigns } = require('../api/fetchAllCompaigns');
const { authenticateAndFetchEmailAccounts } = require('../api/fetchEmailStats');
const config = require('./../config.json');


// Check if user has API key for selected software
exports.checkSoftware = async (req, res) => {
  console.log('CheckSoftware Request');
  const { software } = req.body;

  console.log('Check Software Called',software, req.body);
  

  try {
    // Find user by ID
    const user = await User.findById(req.user.id);

console.log(user);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has the software
    const softwareData =user.softwareKeys.find(
      (item) => item.software === software
    );

    console.log(softwareData);
    

    if (softwareData) {
      // Check if the API key is present for the software
      if (softwareData.apiKey) {
        // Create a JWT token with user ID and software name
         token = jwt.sign(
          { userId: user._id, software},
          config.JWT_SECRET, // Use the JWT secret from .env file
          { expiresIn: '24h' } // Adjust the token expiration as needed
        );

        return res.status(200).json({ 
          message: 'has api', 
          apiKey: softwareData.apiKey,
          softwareToken: token
        });
      } else {
        return res.status(200).json({ message: 'has software but no API key' });
      }
    } else {
      return res.status(404).json({ message: 'has not software' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



// Add API key for selected software
exports.addApiKey = async (req, res) => {
  const { software, apiKey } = req.body;
  console.log("Software Controller, addApiKey: software and apiKey -->", software, apiKey);

  try {
    console.log("Software Controller, addApiKey: req.body.user.id -->", req.body.user.id);
    
    // Check if the API key exists for any other user
    const otherUserWithApiKey = await User.findOne({ 'softwareKeys.apiKey': apiKey });
    
    const softwareToken = jwt.sign(
      { software },
      config.JWT_SECRET, // Use the JWT secret from .env file
      { expiresIn: '10y' } // Adjust the token expiration as needed
    );

    if (otherUserWithApiKey) {
      console.log('API key found for another user, updating current user...');
      
      // Find the current user by ID
      const user = await User.findById(req.body.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the API key already exists for the current user
      const existingSoftware = user.softwareKeys.find(
        (item) => item.apiKey === apiKey
      );

      if (!existingSoftware) {
        // Add the same API key to this user if it doesn't already exist
        user.softwareKeys.push({ software, apiKey });
        await user.save();
        console.log('API key added to current user');
      }

      return res.status(200).json({
        message: 'API key already exists for another user and added to current user',
        softwareToken: softwareToken
      });
    }

    // If no other user has the API key, proceed to check for the current user
    const user = await User.findById(req.body.user.id);
    console.log("Software Controller, addApiKey: user -->", user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingSoftware = user.softwareKeys.find(
      (item) => item.apiKey === apiKey
    );

    if (existingSoftware) {
      console.log('API key already exists for this software and user');
      return res.status(200).json({
        message: 'API key already exists for this software',
        softwareToken: softwareToken
      });
    }

    if (software === 'Smart lead.ai') {
      try {
        // Authenticate and fetch data from external APIs
        const clients = await authenticateAndFetchClients(apiKey, user, software);
        const emails = await authenticateAndFetchEmailAccounts(apiKey, user, software);
        const campaigns = await FetchAllCampaigns(apiKey, user, software);
       
        // Only save the API key if valid responses are received
        user.softwareKeys.push({ software, apiKey });
        await user.save();

        console.log('API key added and data fetched:', softwareToken);
        return res.status(200).json({
          message: 'API key added successfully',
          software: software,
          softwareToken: softwareToken
        });

      } catch (apiError) {
        return res.status(500).json({ message: apiError.message });
      }
    }

    // Default success response if software is not 'Smart lead.ai'
    return res.status(200).json({ message: 'API key added successfully' });

  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
};
