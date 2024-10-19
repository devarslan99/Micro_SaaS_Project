const axios = require('axios');
const Client = require('../models/Client');
const { makeSmartleadApiRequest } = require('../utils/smartleadApiManager'); // Import centralized request manager

const authenticateAndFetchClients = async (apiKey, user, software) => {
  const url = `https://server.smartlead.ai/api/v1/client/?api_key=${apiKey}`;

  try {
    // Make the HTTP request to fetch clients
    const clientsData = await makeSmartleadApiRequest(url, { headers: { accept: 'application/json' } });
    console.log('Fetched Clients:', clientsData);

    // Delete existing clients for this user and software
    await Client.deleteMany({ user_logged_id: user.id, software });

    // Always add a client with clientId set to null
    const nullClient = new Client({
      user_logged_id: user.id,  // Associate with the logged-in user's ID
      software,
      name: 'Base User',  // Customize the default values as needed
      email: 'default@example.com',
      uuid: null,
      createdAt: new Date(),
      userIdFromClient: null,
      logo: 'Base',
      logoUrl: null,
      permission: [],  // Default to empty permissions
      restricted_category: [],  // Default to empty restricted categories
    });

    await nullClient.save();

    // Save each client fetched from the API
    for (const client of clientsData) {
      try {
        const newClient = new Client({
          user_logged_id: user.id,
          software,
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

        await newClient.save();
      } catch (err) {
        console.error(`Error saving client ${client.id}:`, err.message);
        // Continue to the next client without stopping
      }
    }

    return clientsData;
  } catch (err) {
    console.error('Error fetching clients:', err.message);
    throw new Error('An error occurred while fetching clients');
  }
};

module.exports = {
  authenticateAndFetchClients,
};
