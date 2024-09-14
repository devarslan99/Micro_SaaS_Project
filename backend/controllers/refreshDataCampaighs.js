
const {authenticateAndFetchClients} = require('../api/smartleadclient.js')
const { FetchAllCampaigns} = require('../api/fetchAllCompaigns.js')

const refreshDataCampaighs = async (req ,res) => {
   const { apiKey, user, software } = req.body
  try {
    
     const clients = await authenticateAndFetchClients(apiKey,user,software);
      const campaigns=await FetchAllCampaigns(apiKey,user,software)
    //  const emails = await authenticateAndFetchEmailAccounts(apiKey,user,software);
     console.log('Campaighs and Client Fetched Called And runed');
    if(clients && campaigns){
      res.status(200).json({message:"Data Refreshed Successfully"})
    }
  } catch (error) {
    res.status(400).json({error})
  }
};

module.exports = {
    refreshDataCampaighs,
};
