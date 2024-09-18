const mongoose = require('mongoose');

const SelectedClientSchema = new mongoose.Schema({
    software:String,
    user_logged_id: String,
    clientId: {
      type: Number,
      default:null,  // allows both number and null values
      required: false,
    },
    selectedName: String,
  });

  module.exports = mongoose.model('SelectedClient', SelectedClientSchema);