// routes/feedback.js
import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const FEEDBACK_FILE = path.join(process.cwd(), "public/data/feedback.json");
fs.mkdirSync(path.dirname(FEEDBACK_FILE), { recursive: true });

router.post("/", async (req, res) => {
  const { keyword, rating, insight } = req.body;

  console.log("📥 Incoming feedback payload:", { keyword, rating, insight });

  if (
    !keyword ||
    !rating ||
    !insight ||
    !insight.keyword ||
    !insight.insight_title
  ) {
    console.error("❌ Missing fields in feedback payload:", {
      keyword,
      rating,
      insight,
    });
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields." });
  }

  const record = {
    keyword,
    rating,
    prompt_system: insight.prompt?.system || "",
    prompt_user: insight.prompt?.user || "",
    insight_title: insight.insight_title,
    summary: insight.summary,
    suggested_actions: insight.suggested_actions,
    submitted_at: new Date().toISOString(),
  };

  console.log("📝 Saving feedback record:", record);

  let allFeedback = [];
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      const existing = fs.readFileSync(FEEDBACK_FILE, "utf8");
      allFeedback = JSON.parse(existing);
    }
  } catch (e) {
    console.error("⚠️ Could not read existing feedback file, starting fresh.");
  }

  allFeedback.push(record);

  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(allFeedback, null, 2));
  console.log("✅ Feedback saved for keyword:", keyword);

  res.json({ success: true });
});

export default router;
