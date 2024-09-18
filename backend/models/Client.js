const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    user_logged_id: String,
    software: String,
    clientId: {
        type: Number,  // Single value of type Number
        required: false,
        default: null  // Default value is null if not provided
    },
    selectedName: String,
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
