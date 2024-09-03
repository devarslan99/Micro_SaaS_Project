const mongoose = require('mongoose');

// Define the schema for CampaignStats
const DailylevelSchema = new mongoose.Schema({
    user_logged_id:String,
    software:String,
    id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    status: { 
        type: String, 
        required: true // Removed the enum restriction
    },
    name: { type: String, required: true },
    start_date: { type: Date },
    end_date: { type: Date },
    sent_count: { type: Number},
    unique_sent_count: { type: Number}, // represents leads reached
    open_count: { type: Number },
    unique_open_count: { type: Number }, // represents unique open count
    click_count: { type: Number},
    unique_click_count: { type: Number}, // represents unique click count
    reply_count: { type: Number },
    block_count: { type: Number },
    total_count: { type: Number },
    drafted_count: { type: Number },
    bounce_count: { type: Number },
    unsubscribed_count: { type: Number }
});

// Create and export the model
const Dailylevel = mongoose.model('Dailylevel', DailylevelSchema);
module.exports = Dailylevel;
