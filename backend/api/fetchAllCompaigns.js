const axios = require('axios');
const Campaign = require('../models/Campaigns');
const Dailylevel = require('../models/Dailylevel'); // Assuming you have a model for storing campaign stats
const TopLevelStats = require('../models/TopLevelStats');

const FetchAllCampaigns = async (apiKey, user, software) => {
  const url = `https://server.smartlead.ai/api/v1/campaigns/?api_key=${apiKey}`;

  try {
    // Make the HTTP request to fetch campaigns
    const response = await axios.get(url, { headers: { accept: 'application/json' } });
    const campaignsData = response.data;
    console.log(campaignsData);
    
    // Clear previous campaign data
    await Campaign.deleteMany({ user_logged_id: user.id, software });
    await TopLevelStats.deleteMany({ user_logged_id: user.id, software });

    for (const campaign of campaignsData) {
      try {
        // Save campaign data
        const newCampaign = new Campaign({
          user_logged_id: user.id,
          software,
          id: campaign.id,
          user_id: campaign.user_id,
          created_at: new Date(campaign.created_at),
          updated_at: new Date(campaign.updated_at),
          status: campaign.status,
          name: campaign.name,
          track_settings: campaign.track_settings,
          scheduler_cron_value: campaign.scheduler_cron_value,
          min_time_btwn_emails: campaign.min_time_btwn_emails,
          max_leads_per_day: campaign.max_leads_per_day,
          parent_campaign_id: campaign.parent_campaign_id,
          stop_lead_settings: campaign.stop_lead_settings,
          unsubscribe_text: campaign.unsubscribe_text,
          client_id: campaign.client_id
        });

        await newCampaign.save();

        const topLevelAnalyticsUrl = `https://server.smartlead.ai/api/v1/campaigns/${campaign.id}/analytics?api_key=${apiKey}`;
        const topLevelResponse = await axios.get(topLevelAnalyticsUrl, { headers: { accept: 'application/json' } });
        const topLevelData = topLevelResponse.data;

        // Save top-level analytics data
        const newTopLevelStats = new TopLevelStats({
          user_logged_id: user.id,
          software,
          id: campaign.id,
          user_id: campaign.user_id,
          created_at: new Date(topLevelData.created_at),
          status: topLevelData.status,
          name: topLevelData.name,
          sent_count: topLevelData.sent_count,
          open_count: topLevelData.open_count,
          click_count: topLevelData.click_count,
          reply_count: topLevelData.reply_count,
          block_count: topLevelData.block_count,
          total_count: topLevelData.total_count,
          drafted_count: topLevelData.drafted_count,
          bounce_count: topLevelData.bounce_count,
          unsubscribed_count: topLevelData.unsubscribed_count,
          sequence_count: topLevelData.sequence_count,
          tags: topLevelData.tags,
          unique_open_count: topLevelData.unique_open_count,
          unique_click_count: topLevelData.unique_click_count,
          unique_sent_count: topLevelData.unique_sent_count,
          client_id: topLevelData.client_id,
          client_name: topLevelData.client_name,
          client_email: topLevelData.client_email,
          parent_campaign_id: topLevelData.parent_campaign_id,
          campaign_lead_stats: topLevelData.campaign_lead_stats,
        });

        await newTopLevelStats.save();
        console.log(`Saved top-level stats for campaign ${campaign.id}`);
      } catch (err) {
        console.error(`Error processing campaign ${campaign.id}:`, err.message);
        // Continue to the next campaign without stopping
      }
    }

    return response.data;
  } catch (err) {
    console.error('Error fetching campaigns:', err.message);
    throw new Error('An error occurred while fetching campaigns');
  }
};

module.exports = {
  FetchAllCampaigns,
};
