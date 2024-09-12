const mongoose = require('mongoose');

// Define the schema for Campaign
const CampaignSchema = new mongoose.Schema({
    user_logged_id:String,
    software:String,
    id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    status: { 
        type: String, 
        required: true // Removed the enum restriction
    },
    name: { type: String },
    track_settings: {
        type: [String],  // Array of strings
        
    },
    scheduler_cron_value: { 
        type: mongoose.Schema.Types.Mixed, // Changed to Mixed type to handle objects
    },  // Stored as JSON string or use a mixed type if you want to parse it
    min_time_btwn_emails: { type: Number,  }, // in minutes
    max_leads_per_day: { type: Number, },
    parent_campaign_id: { type: Number,  }, // null if it's a parent campaign
    stop_lead_settings: { 
        type: String, 
        enum: ['REPLY_TO_AN_EMAIL', 'CLICK_ON_A_LINK', 'OPEN_AN_EMAIL'], 
        
    },
    unsubscribe_text: { type: String },
    client_id: { type: Number}
});

// Create and export the model
const Campaign = mongoose.model('Campaign', CampaignSchema);
module.exports = Campaign;
