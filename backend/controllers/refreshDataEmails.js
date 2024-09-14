
const {authenticateAndFetchEmailAccounts} = require('../api/fetchEmailStats.js')

const refreshDataEmails = async (req ,res) => {
   const { apiKey, user, software } = req.body
  try {
    
    //  const clients = await authenticateAndFetchClients(apiKey,user,software);
     const emails = await authenticateAndFetchEmailAccounts(apiKey,user,software);
     console.log('Email Fetched Called And runed' , emails);
    //  const campaigns=await FetchAllCampaigns(apiKey,user,software)
    if(emails){
      res.status(200).json({message:"Data Refreshed Successfully",emails})
    }
  } catch (error) {
    res.status(400).json({error})
  }
};

module.exports = {
  refreshDataEmails,
};
