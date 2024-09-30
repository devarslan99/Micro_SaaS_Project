const SelectedClient = require('../models/SelectedClient.js'); 

exports.saveUserSelectedClients = async (req, res) => {
  const { clients, user } = req.body;
  const user_logged_id = user.id; // User ID from request
  
  // Validate clients input
  if (!Array.isArray(clients)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    // Step 1: Find all existing clients for the user, including those with clientId = null
    const existingClients = await SelectedClient.find({
      user_logged_id,
      $or: [
        { clientId: { $in: clients.map(client => client.clientId).filter(id => id !== null) } }, // Non-null clientIds
        { clientId: null } // Include existing clients with clientId = null
      ]
    });

    // Extract clientIds of the already existing clients (convert to strings to avoid type mismatch issues)
    const existingClientIds = existingClients.map(client => String(client.clientId));

    // Step 2: Filter out clients that already exist in the database
    const clientsToSave = clients.filter(client => {
      // Check if clientId is null and if there's already a client with clientId = null
      if (client.clientId === null) {
        return !existingClientIds.includes('null'); // Skip if a null clientId already exists
      }
      // For non-null clientIds, ensure the ID doesn't already exist in the database
      return !existingClientIds.includes(String(client.clientId));
    });

    // Get the clients that are already saved (for the response)
    const alreadySavedClients = clients.filter(client => {
      if (client.clientId === null) {
        return existingClientIds.includes('null'); // If clientId is null and exists, mark it as already saved
      }
      return existingClientIds.includes(String(client.clientId));
    });

    // Step 3: Insert only the new clients (handle clientId = null properly)
    let insertedClients = [];
    if (clientsToSave.length > 0) {
      insertedClients = await SelectedClient.insertMany(
        clientsToSave.map(client => ({
          user_logged_id,
          selectedName: client.selectedName,
          clientId: client.clientId || null // Ensure null is handled correctly
        }))
      );
    }

    // Step 4: Construct response message
    const message = `Clients added: ${insertedClients.length}. Already saved: ${alreadySavedClients.length}.`;

    // Send response with information about saved and skipped clients
    return res.status(201).json({
      message,
      savedClients: insertedClients,
      skippedClients: alreadySavedClients
    });

  } catch (error) {
    console.error('Error adding clients:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//Function for deleting the client
exports.deleteSelectedClient = async (req, res) => {
  const { clientId, user } = req.body;
  const user_logged_id = user.id; // User ID from request

  if (!user_logged_id) {
    return res.status(400).json({ message: 'user_logged_id is required' });
  }

  try {
    // Construct query to find the client
    const query = { user_logged_id };

    // If clientId is provided, include it in the query
    if (clientId !== undefined) {
      query.clientId = clientId; // This will handle both number and null values
    }

    // Find and delete the client by user_logged_id and clientId (if provided)
    const deletedClient = await SelectedClient.findOneAndDelete(query);

    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Send a success message in the response
    return res.status(200).json({
      message: 'Client deleted successfully',
      deletedClient
    });

  } catch (error) {
    console.error('Error deleting client:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};