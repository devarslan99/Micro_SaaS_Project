const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  client:{
    type:Boolean,
    required:true
  },

  date: {
    type: Date,
    default: Date.now,
  },
  softwareKeys: [
    {
      software: { type: String, required: false },
      apiKey: { type: String, required: false },
    }
  ],
});

module.exports = mongoose.model('User', UserSchema);
