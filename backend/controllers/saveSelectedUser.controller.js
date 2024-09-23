
const SelectedClient = require('../models/SelectedClient.js'); 
exports.saveUserSelectedClients = async (req, res) => {

    const { clients, user } = req.body;
    console.log(req.body.software);
    console.log(clients , user);
    const user_logged_id = user.id
    if (!Array.isArray(clients)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
  
    try {
      // First, delete existing clients with the same user_logged_id
      // await SelectedClient.deleteMany({ user_logged_id });
      // Now, insert the new clients
      const insertedClients = await SelectedClient.insertMany(
          clients.map(client => {
            if(client.clientId==null) client.clientId=''

            return ( {
                user_logged_id,
                selectedName:client.selectedName,
                clientId:client.clientId
            })
        }
        )
      );
  
      res.status(201).json({ message: 'Clients added successfully', data: insertedClients });
    } catch (error) {
      console.error('Error adding clients:', error);
      res.status(500).json({ message: 'Server error' });
    }

}