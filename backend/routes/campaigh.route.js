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
                sent_count: { $sum: "$sent_count" },
                unique_sent_count: { $sum: "$unique_sent_count" },
            open_count: { $sum: "$open_count" },
            unique_open_count: { $sum: "$unique_open_count" },
            click_count: { $sum: "$click_count" },
            unique_click_count: { $sum: "$unique_click_count" },
            reply_count: { $sum: "$reply_count" },
            bounce_count: { $sum: "$bounce_count" },
                // Sum of campaign_lead_stats.inprogress and notStarted fields
            total: { $sum: "$campaign_lead_stats.total" },
            inprogress: { $sum: "$campaign_lead_stats.inprogress" },
            intrested: { $sum: "$campaign_lead_stats.interested" },
            notStarted: { $sum: "$campaign_lead_stats.notStarted" }
            }
        }
    ]);

    // Return or log the result
    console.log("Aggregated Stats: ", result[0]);
    res.status(200).json(result);
     result;

} catch (error) {
    console.error("Error during aggregation: ", error);
    throw error;
}

})

router.get('/daily',dailyCompaighs)

module.exports = router;