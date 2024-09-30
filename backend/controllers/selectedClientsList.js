const SelectedClient = require('../models/SelectedClient.js');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

   
   exports.SelectedClient =  async (req, res) => {
    const softwareToken = req.header('softwareToken');
    const authToken = req.header('authToken');
    
    console.log("Software Token", softwareToken);
    console.log("AuthToken", authToken);
    
    if (!softwareToken) {
      return res.status(400).json({ message: 'Software token is required' });
    }
    
    try {
      // Decode the tokens to get software and user information
      const decoded = jwt.verify(softwareToken, config.JWT_SECRET);
      const decodedAuth = jwt.verify(authToken, config.JWT_SECRET);
      console.log("DecodedToken:",decoded);
      const softwareName = decoded.software;
      
      console.log("Software name", softwareName);
      console.log("User logged ID", decodedAuth);
      const userLoggedId = decodedAuth.user.id;
    
      if (!softwareName) {
        return res.status(404).json({ message: 'Software not found' });
      }
    
      // Find clients based on software name and user_logged_id
      const clients = await SelectedClient.find({
        user_logged_id: userLoggedId
      });
    
      // Return the found clients
      res.status(200).json(clients);
    
    } catch (err) {
      console.error('Error fetching clients:', err.message);
      res.status(500).json({ message: 'Failed to fetch clients', error: err.message });
    }
}