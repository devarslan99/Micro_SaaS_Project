const Client = require('../models/Client.js');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const express = require('express')
const router = express.Router()
const {saveUserSelectedClients, deleteSelectedClient} = require('../controllers/saveSelectedUser.controller.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const {SelectedClient} = require('../controllers/selectedClientsList.js');
const { updateSelectedName } = require('../controllers/renameSelectedClient.controller.js');
const { route } = require('./campaigh.route.js');
const { addClientDetails } = require('../controllers/authController.js');


router.get('/clients', async (req, res) => {
  const softwareToken = req.header('softwareToken');
    console.log("Software Token", softwareToken)
  
    if (!softwareToken) {
      return res.status(400).json({ message: 'Software token is required' });
    }
  
    try {
      // Decode the token to get software information
      const decoded = jwt.verify(softwareToken, config.JWT_SECRET);
      const softwareName = decoded.software;

      console.log("Software name",softwareName)
  
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
router.post('/save-client-data',authMiddleware,saveUserSelectedClients)
router.get('/selectedClients',SelectedClient)
router.post('/client/delete',authMiddleware,deleteSelectedClient)
router.post('/client/update',authMiddleware,updateSelectedName)
router.post('/client/credentials',authMiddleware,addClientDetails)
  module.exports = router;


// In your controller: