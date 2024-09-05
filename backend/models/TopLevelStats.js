const mongoose = require('mongoose');

// Define the schema for Tags
const TagSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
});

// Define the schema for CampaignLeadStats
const CampaignLeadStatsSchema = new mongoose.Schema({
    total: { type: Number, required: true },
    blocked: { type: Number, required: true },
    stopped: { type: Number, required: true },
    completed: { type: Number, required: true },
    inprogress: { type: Number, required: true },
    interested: { type: Number, required: true },
    notStarted: { type: Number, required: true },
});

// Define the schema for TopLevelStats
const TopLevelStatsSchema = new mongoose.Schema({
    user_logged_id: { type: String, required: true },
    software: { type: String, required: true },
    id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    status: { type: String, required: true },
    name: { type: String },
    sent_count: { type: Number, default: 0 },
    open_count: { type: Number, default: 0 },
    click_count: { type: Number, default: 0 },
    reply_count: { type: Number, default: 0 },
    block_count: { type: Number, default: 0 },
    total_count: { type: Number, default: 0 },
    drafted_count: { type: Number, default: 0 },
    bounce_count: { type: Number, default: 0 },
    unsubscribed_count: { type: Number, default: 0 },
    sequence_count: { type: Number, default: 0 },
    tags: [TagSchema],
    unique_open_count: { type: Number, default: 0 },
    unique_click_count: { type: Number, default: 0 },
    unique_sent_count: { type: Number, default: 0 },
    client_id: { type: Number,  },
    client_name: { type: String,  },
    client_email: { type: String,  },
    parent_campaign_id: { type: Number, default: null },
    campaign_lead_stats: { type: CampaignLeadStatsSchema, },
});

// Create and export the model
const TopLevelStats = mongoose.model('TopLevelStats', TopLevelStatsSchema);
module.exports = TopLevelStats;
