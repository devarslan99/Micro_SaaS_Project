const config = require('./../config.json');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');
const Campaign = require('../models/Campaigns'); // Assuming Campaign model is in models folder

exports.dailyCompaighs = async (req, res) => {
  
  const token = req.header("token")
  const clientID = req.header("clientID")
  const startDate = req.header("startDate")
  const endDate = req.header("endDate")
  const decoded = jwt.verify(token, config.JWT_SECRET);
  let userID = decoded.user;
  const user = await User.findById(userID.id);

  // Extract API key
  const API_KEY = user.softwareKeys[0].apiKey;

  // Function to get campaign IDs by client ID
  const getCampaignIdsByClientId = async (clientId) => {
    try {
      const campaigns = await Campaign.find({ client_id: clientId }, 'id');
      const campaignIds = campaigns.map(campaign => campaign.id);
      return campaignIds;
    } catch (error) {
      console.error('Error fetching campaign IDs:', error);
      throw error;
    }
  };

  // Fetch the campaign IDs
  const campaignIds = await getCampaignIdsByClientId(clientID);
console.log(campaignIds);
  // Prepare the start and end dates (you can adjust these accordingly)
  // const startDate = '2024-08-01';
  // const endDate = '2024-08-23';

  // Function to fetch data for a single campaign
  const fetchCampaignData = async (campaignId) => {
    const url = `https://server.smartlead.ai/api/v1/campaigns/${campaignId}/analytics-by-date?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    
    try {
      const response = await axios.get(url, { headers: { accept: 'application/json' } });
      return {
        campaignId,
        data: response.data
      };
    } catch (err) {
      console.error(`Error fetching data for campaign ID ${campaignId}:`, err);
      return { campaignId, error: err.message }; // Return error information if the request fails
    }
  };

  // Fetch data for each campaign ID
  try {
    const campaignDataArray = await Promise.all(
      campaignIds.map(campaignId => fetchCampaignData(campaignId))
    );
//Summing all the fields 
// Initialize an object to store the totals
let totals = {
    sent_count: 0,
    unique_sent_count: 0,
    open_count: 0,
    unique_open_count: 0,
    click_count: 0,
    unique_click_count: 0,
    reply_count: 0,
    block_count: 0,
    total_count: 0,
    drafted_count: 0,
    bounce_count: 0
};

// Iterate over the campaign array and sum the values
campaignDataArray.forEach(campaign => {
    const data = campaign.data;
    totals.sent_count += parseInt(data.sent_count, 10);
    totals.unique_sent_count += parseInt(data.unique_sent_count, 10);
    totals.open_count += parseInt(data.open_count, 10);
    totals.unique_open_count += parseInt(data.unique_open_count, 10);
    totals.click_count += parseInt(data.click_count, 10);
    totals.unique_click_count += parseInt(data.unique_click_count, 10);
    totals.reply_count += parseInt(data.reply_count, 10);
    totals.block_count += parseInt(data.block_count, 10);
    totals.total_count += parseInt(data.total_count, 10);
    totals.drafted_count += parseInt(data.drafted_count, 10);
    totals.bounce_count += parseInt(data.bounce_count, 10);
});

// Output the summed totals
console.log(totals);
    // Return the array of campaign data objects
    res.status(200).json(totals);
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).json({ message: 'Error fetching campaign data' });
  }
};
