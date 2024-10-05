const express = require("express");
const router = express.Router();
const TopLevelStats = require("../models/TopLevelStats");
const { dailyCompaighs } = require("../controllers/dailyCompain.controller");

router.get("/top-level-stats", async (req, res) => {
  console.log("Request Recieved to /top-level-stats");
  let dbClientId = null;
  // const clientId = null
  const clientId = req.header("clientId");
  if (clientId !== "null" && clientId !== null) {
    dbClientId = Number(clientId);
  }
  console.log(typeof dbClientId, dbClientId);

  try {
    const result = await TopLevelStats.aggregate([
      // Stage 1: Match documents with a specific client_id
      {
        $match: {
          client_id: dbClientId,
        },
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
          notStarted: { $sum: "$campaign_lead_stats.notStarted" },
        },
      },
    ]);

    // Return or log the result
    if (result.length === 0) {
      console.log("No Data found for that client");
      res.status(404).json({ message: "No Data found for that client" });
    } else {
      console.log("Aggregated Stats: ", result[0]);
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error during aggregation: ", error);
    throw error;
  }
});

router.get("/daily", dailyCompaighs);

module.exports = router;
