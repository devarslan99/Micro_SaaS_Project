
const axios = require('axios');
const Campaign = require('../models/Campaigns');
// const Dailylevel = require('../models/Dailylevel'); // Assuming you have a model for storing campaign stats
const TopLevelStats = require('../models/TopLevelStats');


const refreshData = async (req ,res) => {
   const { apiKey, user, software } = req.body
  try {
    
     const clients = await authenticateAndFetchClients(apiKey,user,software);
     const emails = await authenticateAndFetchEmailAccounts(apiKey,user,software);
     const campaigns=await FetchAllCampaigns(apiKey,user,software)
    if(emails && clients && campaigns){
      res.status(200).json({message:"Data Refreshed Successfully"})
    }
  } catch (error) {
    res.status(400).json({error})
  }
};

module.exports = {
    refreshData,
};
