const express = require('express')
const router = express.Router()
const TopLevelStats = require('../models/TopLevelStats'); 
const {dailyCompaighs} = require('../controllers/dailyCompain.controller')

router.get('/top-level-stats',async (req , res)=>{
    
const clientId = req.header("clientId")
console.log('Request Recieved to /top-level-stats');
console.log(clientId);

try {
    const result = await TopLevelStats.aggregate([
        // Stage 1: Match documents with a specific client_id
        {
            $match: {
                client_id: clientId
            }
        },
        // Stage 2: Group and calculate the sum of the required fields
        {
            $group: {
                _id: null, // We are grouping all documents, so _id is null
                total_open_count: { $sum: "$open_count" },
                total_sent_count: { $sum: "$sent_count" },
                total_click_count: { $sum: "$click_count" },
                total_reply_count: { $sum: "$reply_count" },
                total_bounce_count: { $sum: "$bounce_count" },
                total_unique_open_count: { $sum: "$unique_open_count" },
                total_unique_click_count: { $sum: "$unique_click_count" },
                total_unique_sent_count: { $sum: "$unique_sent_count" },
                // Sum of campaign_lead_stats.inprogress and notStarted fields
                total_count: { $sum: "$campaign_lead_stats.total" },
                total_inprogress: { $sum: "$campaign_lead_stats.inprogress" },
                total_intrested: { $sum: "$campaign_lead_stats.interested" },
                total_notStarted: { $sum: "$campaign_lead_stats.notStarted" }
            }
        }
    ]);

    // Return or log the result
    console.log("Aggregated Stats: ", result);
    res.status(200).json(result);
     result;

} catch (error) {
    console.error("Error during aggregation: ", error);
    throw error;
}

})

router.get('/daily',dailyCompaighs)

module.exports = router;