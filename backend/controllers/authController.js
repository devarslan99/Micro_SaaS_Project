const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config=require('./../config.json')
const SelectedClient = require('../models/SelectedClient')

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
//Checking If user Already Exist
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: 'User already exists.Please SignIn' });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.client= false
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: '10y' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.send({msg:'Server error'});
  }
};

//LogIn Logic for both client and user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return res.json({ msg: "Email and password are required." });
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.json({ msg: "Invalid email format." });
  }

  try {
    // First, search for the user in the User collection
    let user = await User.findOne({ email });
    
    if (user) {
      // User found in the User collection
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ msg: 'Invalid credentials' });
      }

      // Create payload for user authentication token
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign JWT token for user authentication
      jwt.sign(
        payload,
        config.JWT_SECRET,
        { expiresIn: '24h' }, // User token valid for 24 hours
        async (err, token) => {
          if (err) throw err; // Error handling

          // Check if user has software with an API key
          let softwareToken;
          let apiKey;
          let software;

          if (user.softwareKeys && user.softwareKeys.length > 0) {
            const softwareData = user.softwareKeys.find(item => item.apiKey);
            if (softwareData) {
              apiKey = softwareData.apiKey;
              software = softwareData.software;
              softwareToken = jwt.sign(
                { software }, // Include software name
                config.JWT_SECRET,
                { expiresIn: '10y' } // Token valid for 10 years
              );
            }
          }

          // Send response with both user token and software token (if available)
          res.json({
            token, // User login token
            ...(softwareToken && { softwareToken }), // Include software token if it exists
            ...(apiKey && { apiKey }), // Include API key if it exists
            ...(software && { software }), // Include software name if it exists
            isClient:false,
            name:user.name
          });
        }
      );
    } else {
      // If user not found, search in the SelectedClient collection
      let client = await SelectedClient.findOne({ email });
      if (!client) {
        return res.json({ msg: 'Invalid credentials' });
      }

      // Compare client password
      const isMatch = await bcrypt.compare(password, client.password);
      if (!isMatch) {
        return res.json({ msg: 'Invalid credentials' });
      }

      // Send authToken and softwareToken from the client collection
      res.json({
        token: client.authToken,
        softwareToken: client.SoftwareToken,
        clientId: client.clientId, // Return clientId if needed
        isClient:true,
        name:client.name
      });
    }
  } catch (err) {
    console.error(err.message);
    res.json({ msg: 'Server error' });
  }
};


const changePassword = async (req, res) => {
  const { oldPassword, newPassword, user } = req.body;
  const user_logged_id = user.id; // Assuming user ID is passed in the user object

  // Validate input
  // if (!oldPassword || !newPassword || !user_logged_id) {
  //   return res.status(400).json({ msg: 'Old password, new password, and user ID are required.' });
  // }

  try {
    // Find the user by user ID
    let foundUser = await User.findById(user_logged_id);
    // if (!foundUser) {
    //   return res.status(404).json({ msg: 'User not found.' });
    // }

    // // Compare the old password with the stored hashed password
    // const isMatch = await bcrypt.compare(oldPassword, foundUser.password);
    // if (!isMatch) {
    //   return res.status(400).json({ msg: 'Old password is incorrect.' });
    // }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    foundUser.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user document
    await foundUser.save();

    // Send success response
    return res.status(200).json({ msg: 'Password changed successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ msg: 'Server error.' });
  }
};

//Register A Client
const addClientDetails = async (req, res) => {
  const { clientId, email, password } = req.body; // Get email and password from the body
  const user_logged_id = req.body.user.id; // Assuming the user is authenticated and this is set in req.user
  // Get tokens from headers
  const authToken = req.headers['authorization']; // Lowercased header name 'authorization'
  const SoftwareToken = req.headers['softwareauthorization']; // Lowercased header name 'softwareauthorization'

  // Ensure the tokens are present
  if (!authToken || !SoftwareToken) {
    return res.status(400).json({ msg: 'Missing authToken or SoftwareToken in headers.' });
  }

  try {
    // First, check if the email already exists in either User or SelectedClient collection
    const userWithEmail = await User.findOne({ email });
    const clientWithEmail = await SelectedClient.findOne({ email });

    if (userWithEmail || clientWithEmail) {
      return res.status(400).json({ msg: 'Email already exists in the system.' });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(clientId, user_logged_id );
    // Find the client by clientId and user_logged_id and update the fields
    const updatedClient = await SelectedClient.findOneAndUpdate(
      { clientId, user_logged_id },  // Match on clientId and user_logged_id
      {
        $set: {
          email,
          password: hashedPassword, // Save the hashed password
          authToken,
          SoftwareToken
        }
      },
      { new: true }  // Return the updated document
    );

    if (!updatedClient) {
      return res.status(404).json({ msg: 'Client not found for the provided clientId and user_logged_id.' });
    }

    res.json({ msg: 'Client details updated successfully', client: updatedClient });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: 'Server error' });
  }
};



module.exports = {
  registerUser,
  loginUser,
  changePassword,
  addClientDetails
};
