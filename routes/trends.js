// routes/trends.js
import express from "express";
import axios from "axios";
import { exec } from "child_process";
import { DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD } from "../config.js";

const router = express.Router();

router.get("/local", (req, res) => {
  console.log("📡 Fetch request received — fetching local trends...");

  exec(
    "node dfsTrends.cjs",
    { cwd: process.cwd() },
    (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error running dfsTrends.cjs:", error.message);
        return res.status(500).json({ success: false, message: error.message });
      }

      console.log("✅ dfsTrends.cjs executed successfully.");
      res.json({
        success: true,
        message: "Trend data fetched and indexed.",
        output: stdout,
      });
    }
  );
});

router.post("/live", async (req, res) => {
  const {
    keywords = [],
    location_code = 2554,
    time_range = "past_90_days",
  } = req.body;

  if (!Array.isArray(keywords) || keywords.length === 0) {
    return res.status(400).json({ error: "Invalid keyword list" });
  }

  const auth = Buffer.from(
    `${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`
  ).toString("base64");
  const results = [];

  for (const keyword of keywords) {
    try {
      const payload = [
        {
          keywords: [keyword],
          location_code,
          language_code: "en",
          time_range,
          category_code: 0,
          item_types: [
            "google_trends_topics_list",
            "google_trends_queries_list",
          ],
        },
      ];

      const response = await axios.post(
        "https://api.dataforseo.com/v3/keywords_data/google_trends/explore/live",
        payload,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        }
      );

      const taskResult = response.data?.tasks?.[0]?.result?.[0]?.items || [];
      results.push({ keyword, items: taskResult });
    } catch (err) {
      console.error(`❌ Failed to fetch trend for ${keyword}`, err.message);
      results.push({ keyword, error: true, message: err.message });
    }
  }

  res.json({ success: true, results });
});

export default router;
