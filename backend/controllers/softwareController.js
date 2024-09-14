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
  console.log("Sotfware Controller , addApiKey:Function :line 67-software-apiKey-->",software, apiKey);
  

  try {
    console.log("Sotfware Controller , addApiKey:Function :line 71-req.body.user.id -->",req.body.user.id);
    const user = await User.findById(req.body.user.id);
    console.log("Sotfware Controller , addApiKey:Function :line 73-user -->",user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const existingSoftware = user.softwareKeys.find(
      (item) => item.apiKey === apiKey
    );
    
    const softwareToken = jwt.sign(
      {software},
      config.JWT_SECRET, // Use the JWT secret fr om .env file
      { expiresIn: '24h' } // Adjust the token expiration as needed
    );
    if (existingSoftware) {
      // return res.status(200).json({ message: 'API key already exists for this software' });
      console.log(existingSoftware);
      return res.status(200).json({ 
        message: 'API key Already Exist', 
        softwareToken: softwareToken
      });
    }
    
     


    if (software === 'Smart lead.ai') {
      try {
        const clients = await authenticateAndFetchClients(apiKey,user,software);
        const emails = await authenticateAndFetchEmailAccounts(apiKey,user,software);
        const campaigns=await FetchAllCampaigns(apiKey,user,software)
       
    
        //Only save the api key when it gives the clients emails and campaighs
        user.softwareKeys.push({ software, apiKey });
        await user.save();
        console.log(softwareToken);
        console.log(clients );
        //Setting the Software Token in the Cookie 

        return res.status(200).json({ 
          message: 'API key added successfully', 
          software:software,
          softwareToken: softwareToken
        });
        
      } catch (apiError){
        return res.status(500).json({ message: apiError.message });
      }
    } 
    return res.status(200).json({ message: 'API key added successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
};
