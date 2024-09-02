const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateAndFetchClients } = require('../api/smartleadclient');

// Check if user has API key for selected software
exports.checkSoftware = async (req, res) => {
  const { software } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has the software
    const softwareData =user.softwareKeys.find(
      (item) => item.software === software
    );

    if (softwareData) {
      // Check if the API key is present for the software
      if (softwareData.apiKey) {
        // Create a JWT token with user ID and software name
        const token = jwt.sign(
          { userId: user._id, software},
          process.env.JWT_SECRET, // Use the JWT secret from .env file
          { expiresIn: '1h' } // Adjust the token expiration as needed
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

  try {
    const user = await User.findById(req.user.id);
    const existingSoftware = user.softwareKeys.find(
      (item) => item.software === software
    );

    if (existingSoftware) {
      return res.status(400).json({ message: 'API key already exists for this software' });
    }

    user.softwareKeys.push({ software, apiKey });
    await user.save();
    if (software === 'smartlead.ai') {
      try {
        const clients = await authenticateAndFetchClients(apiKey,user,software);
        return res.status(200).json({ message: 'API key added successfully', clients });
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
