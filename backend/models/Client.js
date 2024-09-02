const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    user_logged_id:String,
    software:String,
    clientId: Number,
    name: String,
    email: String,
    uuid: String,
    created_at: Date,
    user_id: Number,
    logo: String,
    logo_url: String,
    permission: {
        type: [String],
        default: []
      },
      restricted_category: {
        type: [String],
        default: []
      }
  });

  module.exports = mongoose.model('Client', ClientSchema);