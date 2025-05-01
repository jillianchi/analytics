// TrendAI.cjs
const fs = require("fs");
const path = require("path");
import { OPENAI_API_KEY, OPENAI_MODEL } from "../config.js";
import { Configuration, OpenAIApi } from "openai";
require("dotenv").config();

const ARCHIVE_DIR = "./public/data/archive/google_trends";
const INSIGHTS_DIR = "./public/data/ai_insights";
fs.mkdirSync(INSIGHTS_DIR, { recursive: true });

const config = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

function getLatestTrendFile() {
  const files = fs
    .readdirSync(ARCHIVE_DIR)
    .filter((f) => f.startsWith("raw_trends_") && f.endsWith(".json"))
    .sort()
    .reverse();
  return files[0] ? path.join(ARCHIVE_DIR, files[0]) : null;
}

function formatPrompt(keyword, queries, topics) {
  const risingQueries = queries.rising
    .slice(0, 5)
    .map((q) => `- "${q.query}" (+${q.value})`)
    .join("\n");
  const risingTopics = topics.rising
    .slice(0, 5)
    .map((t) => `- "${t.topic_title}" (+${t.value})`)
    .join("\n");

  return `You are a marketing trend analyst. Based on the rising Google Trends queries and topics for the keyword "${keyword}", extract key themes and provide a sharp insight with a practical suggestion for an e-commerce operator.

Rising Queries:
${risingQueries}

Rising Topics:
${risingTopics}

Respond in this format:
{
  "keyword": "${keyword}",
  "insight_title": string,
  "summary": string,
  "suggested_action": string
}`;
}

async function generateInsightFromFile(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const resultBlock = raw.result?.[0];
  const keyword = resultBlock?.keywords?.[0];

  const queries = resultBlock?.items?.find(
    (i) => i.type === "google_trends_queries_list"
  )?.data;
  const topics = resultBlock?.items?.find(
    (i) => i.type === "google_trends_topics_list"
  )?.data;

  if (!keyword || !queries || !topics) {
    console.error("❌ Invalid trend format in:", filePath);
    return null;
  }

  const prompt = formatPrompt(keyword, queries, topics);

  try {
    const completion = await openai.createChatCompletion({
      model: OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an e-commerce insight generator." },
        { role: "user", content: prompt },
      ],
    });

    const insight = completion.data.choices[0].message.content;
    const filename = `trend_insights_${new Date()
      .toISOString()
      .slice(0, 10)}_${keyword}.json`;
    const outPath = path.join(INSIGHTS_DIR, filename);

    fs.writeFileSync(outPath, insight);
    console.log("✅ Insight saved to:", outPath);
    return JSON.parse(insight);
  } catch (err) {
    console.error("❌ Failed to generate insight:", err.message);
    return null;
  }
}

// If run directly
if (require.main === module) {
  const latestFile = getLatestTrendFile();
  if (!latestFile) return console.error("❌ No trend file found.");
  generateInsightFromFile(latestFile);
}

// Exportable for server-side use
module.exports = { generateInsightFromFile };
