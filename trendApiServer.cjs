const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const axios = require("axios");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Needed for POST bodies

// 🔁 Original endpoint — executes local script
app.get("/api/fetch-trends", (req, res) => {
  console.log("📡 Fetch request received — running dfsTrends.cjs...");

  exec("node dfsTrends.cjs", { cwd: __dirname }, (error, stdout, stderr) => {
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
  });
});

// ✅ New endpoint — fetches trend data live from DFS API for multiple keywords
app.post("/api/fetch-multi-trend", async (req, res) => {
  const {
    keywords = [],
    location_code = 2554, // NZ default
    time_range = "past_90_days", // default
  } = req.body;

  if (!Array.isArray(keywords) || keywords.length === 0) {
    return res.status(400).json({ error: "Invalid keyword list" });
  }

  const apiKey = process.env.DATAFORSEO_LOGIN;
  const apiSecret = process.env.DATAFORSEO_PASSWORD;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

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
      results.push({
        keyword,
        items: taskResult,
      });
    } catch (err) {
      console.error(`❌ Failed to fetch trend for ${keyword}`, err.message);
      results.push({
        keyword,
        error: true,
        message: err.message,
      });
    }
  }

  res.json({ success: true, results });
});

// 🧠 AI-powered trend analysis
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/analyze-trends", async (req, res) => {
  const { keyword, items } = req.body;

  try {
    const queries =
      items.find((i) => i.type === "google_trends_queries_list")?.data
        ?.rising || [];
    const topics =
      items.find((i) => i.type === "google_trends_topics_list")?.data?.rising ||
      [];

    const formattedPrompt = `
You are a marketing trend analyst. Based on the rising Google Trends queries and topics for the keyword "${keyword}", extract key themes and provide an insight with suggested actions.

Rising Queries:
${queries
  .slice(0, 5)
  .map((q) => `- "${q.query}" (+${q.value})`)
  .join("\n")}

Rising Topics:
${topics
  .slice(0, 5)
  .map((t) => `- "${t.topic_title}" (+${t.value})`)
  .join("\n")}

Respond in this format:
{
  "keyword": "${keyword}",
  "insight_title": string,
  "summary": string,
  "suggested_action": string
}
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an e-commerce insight generator." },
        { role: "user", content: formattedPrompt },
      ],
    });

    const insightJSON = completion.choices[0].message.content;

    const parsed = JSON.parse(insightJSON);

    res.json({ success: true, insight: parsed });
  } catch (err) {
    console.error("❌ Failed to generate trend insight:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Trend API server running at http://localhost:${PORT}`);
});
