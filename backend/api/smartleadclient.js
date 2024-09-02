const axios = require('axios');
const Client = require('../models/Client');

const authenticateAndFetchClients = async (apiKey,user,software) => {
  const url = `https://server.smartlead.ai/api/v1/client/?api_key=${apiKey}`;

  try {
    // Make the HTTP request to fetch clients
    const response = await axios.get(url, { headers: { accept: 'application/json' } });
       const clientsData=response.data;
       console.log(clientsData);
     

      for (const client of clientsData) {
        const newClient = new Client({
          user_logged_id: user.id,  // Associate with the logged-in user's ID
          software:software,
          clientId: client.id,
          name: client.name,
          email: client.email,
          uuid: client.uuid,
          createdAt: client.created_at,
          userIdFromClient: client.user_id,
          logo: client.logo,
          logoUrl: client.logo_url,
          
            permission: client.client_permision?.permission || [],  // Accessing permission with the correct key
            restricted_category: client.client_permision?.retricted_category || [], // Accessing restricted_category with the correct key
         
        });
        console.log(client.client_permision.permission);
        await newClient.save()
      }

    return response.data;
  } catch (err) {
    console.error('Error fetching clients:', err.message);
    throw new Error('An error occurred while fetching clients');
  }
};

module.exports = {
  authenticateAndFetchClients,
};
