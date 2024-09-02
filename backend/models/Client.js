const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    user_logged_id:String,
    clientId: Number,
    name: String,
    email: String,
    uuid: String,
    created_at: Date,
    user_id: Number,
    logo: String,
    logo_url: String,
    client_permission: {
      permission: [String],
      restricted_category: [String]
    }
  });

  module.exports = mongoose.model('Client', ClientSchema);