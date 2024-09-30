const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config=require('./../config.json')

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

// Login a user
// const loginUser = async (req, res) => {
//   const {email, password } = req.body;
// console.log(req.body);
// if (!email || !password) {
//   return res.json({ msg: "Email and password are required." });
// }

// // Email format validation
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// if (!emailRegex.test(email)) {
//   return res.json({ msg: "Invalid email format." });
// }
//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.json({ msg: 'Invalid credentials' });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };

//     jwt.sign(
//       payload,
//       config.JWT_SECRET,
//       { expiresIn: '24h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.json({ msg:'Server error'});
//   }
// };

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

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
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: 'User not found' });
    }

    // Compare provided password with stored hashed password
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

        // If user has softwareKeys, find the first one with an API key
        if (user.softwareKeys && user.softwareKeys.length > 0) {
          const softwareData = user.softwareKeys.find(item => item.apiKey);

          if (softwareData) {
            apiKey = softwareData.apiKey;
            software = softwareData.software;
              console.log(software);
            // Generate a software token only including the software name
            softwareToken = jwt.sign(
              { software }, // Only include software name
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
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.json({ msg: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, user } = req.body;
  const user_logged_id = user.id; // Assuming user ID is passed in the user object

  // Validate input
  if (!oldPassword || !newPassword || !user_logged_id) {
    return res.status(400).json({ msg: 'Old password, new password, and user ID are required.' });
  }

  try {
    // Find the user by user ID
    let foundUser = await User.findById(user_logged_id);
    if (!foundUser) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect.' });
    }

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
const registerClient = async (req, res) => {
  const {name, username, password } = req.body;
//Checking If user Already Exist
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.json({ msg: 'Client already exists.Please SignIn' });
    }

    user = new User({
      name,
      email:username,
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

const loginClient = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  // Check if email or password is missing
  if (!username || !password) {
    return res.json({ msg: "Email and password are required." });
  }


  try {
    // Find user by email
    let user = await User.findOne({ email:username });
    if (!user) {
      return res.json({ msg: 'User not found' });
    }

    // Compare provided password with stored hashed password
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

        // If user has softwareKeys, find the first one with an API key
        if (user.softwareKeys && user.softwareKeys.length > 0) {
          const softwareData = user.softwareKeys.find(item => item.apiKey);

          if (softwareData) {
            apiKey = softwareData.apiKey;
            software = softwareData.software;
              console.log(software);
            // Generate a software token only including the software name
            softwareToken = jwt.sign(
              { software }, // Only include software name
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
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.json({ msg: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword
};
