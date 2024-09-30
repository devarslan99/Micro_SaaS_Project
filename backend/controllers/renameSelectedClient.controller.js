const SelectedClient = require('../models/SelectedClient.js'); 

exports.updateSelectedName = async (req, res) => {
  const { clientId, user, newSelectedName } = req.body;
  const user_logged_id = user.id; // User ID from request
  if (!clientId || !user_logged_id || !newSelectedName) {
    return res.status(400).json({ message: 'clientId, user_logged_id, and newSelectedName are required' });
  }

  try {
    // Find the client by user_logged_id and clientId, then update the selectedName
    const updatedClient = await SelectedClient.findOneAndUpdate(
      { clientId, user_logged_id }, // Find the client with matching clientId and user_logged_id
      { selectedName: newSelectedName }, // Update the selectedName
      { new: true } // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Send the updated client data in the response
    return res.status(200).json({
      message: 'Client updated successfully',
      updatedClient
    });

  } catch (error) {
    console.error('Error updating selectedName:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
