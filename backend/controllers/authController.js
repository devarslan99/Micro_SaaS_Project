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
const loginUser = async (req, res) => {
  const {email, password } = req.body;
console.log(req.body);
if (!email || !password) {
  return res.json({ msg: "Email and password are required." });
}

// Email format validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!emailRegex.test(email)) {
  return res.json({ msg: "Invalid email format." });
}
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.json({ msg:'Server error'});
  }
};

module.exports = {
  registerUser,
  loginUser,
};
