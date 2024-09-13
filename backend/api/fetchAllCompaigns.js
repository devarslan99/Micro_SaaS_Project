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
    await Campaign.deleteMany({ user_logged_id: user.id, software: software });
    await TopLevelStats.deleteMany({ user_logged_id: user.id, software: software });
    for (const campaign of campaignsData) {
    
      // Save campaign data using your Campaign model
      const newCampaign = new Campaign({
        user_logged_id: user.id,
        software: software, // Example software field
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

      try {
        const topLevelResponse = await axios.get(topLevelAnalyticsUrl, { headers: { accept: 'application/json' } });
        const topLevelData = topLevelResponse.data;
            console.log('topleveldata',topLevelData);
        // Save top-level analytics data
        const newTopLevelStats = new TopLevelStats({
          user_logged_id: user.id,
          software: software,
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
        console.log('done2');
      } catch (err) {
        console.error(`Error fetching top-level stats for campaign ${campaign.id}:`, err.message);
        throw new Error('An error occurred while fetching campaigns');
      }



      // Fetch campaign statistics by date range
      // const campaignId = campaign.id;
      // const createdAt = new Date(campaign.created_at);
      // const today = new Date();
      // const dayInMilliseconds = 24 * 60 * 60 * 1000;

//       for (let date = createdAt; date <= today; date = new Date(date.getTime() + dayInMilliseconds)) {
//         const dateString = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
//         const startDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//         const endDate = new Date(date.getTime() + dayInMilliseconds).toISOString().split('T')[0]; // Next day as the end date
//            console.log('start date',startDate);
//            console.log('end date',endDate);
//         const statsUrl = `https://server.smartlead.ai/api/v1/campaigns/${campaignId}/analytics-by-date?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;
    

//         try {
//           const statsResponse = await axios.get(statsUrl, { headers: { accept: 'application/json' } });
//           const statsData = statsResponse.data;

//           // Save the required statistics
//           const newStats = new Dailylevel({
//             user_logged_id: user.id,
//             software: 'smartlead.ai',
//             id: campaignId,
//             date: startDate,
//             user_id: campaign.user_id,
//             created_at: createdAt,
//             status: campaign.status,
//             name: campaign.name,
//             sent_count: statsData.sent_count || 0,
//             unique_sent_count: statsData.unique_sent_count || 0,
//             open_count: statsData.open_count || 0,
//             unique_open_count: statsData.unique_open_count || 0,
//             click_count: statsData.click_count || 0,
//             unique_click_count: statsData.unique_click_count || 0,
//             reply_count: statsData.reply_count || 0,
//             block_count: statsData.block_count || 0,
//             total_count: statsData.total_count || 0,
//             drafted_count: statsData.drafted_count || 0,
//             bounce_count: statsData.bounce_count || 0,
//             unsubscribed_count: statsData.unsubscribed_count || 0,
//           });
// console.log('done');
//           await newStats.save();
//         } catch (err) {
//           console.error(`Error fetching stats for campaign ${campaignId} on ${dateString}:`, err.message);
//         }
//       }
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
