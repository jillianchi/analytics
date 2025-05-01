// routes/analyze.js
import express from "express";
import OpenAI from "openai";
import {
  buildSystemMessage,
  buildUserPrompt,
} from "../services/promptBuilder.js";
import { organizationContext } from "../orgContext.js";
import { OPENAI_API_KEY, OPENAI_MODEL } from "../config.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

router.post("/", async (req, res) => {
  const { keyword, items, persona } = req.body;

  if (!keyword || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ success: false, error: "Missing or invalid keyword/items" });
  }

  try {
    const prompt_user = buildUserPrompt(keyword, items);
    const prompt_system = buildSystemMessage(persona, organizationContext);

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt_system },
        { role: "user", content: prompt_user },
      ],
    });

    const raw = completion.choices[0].message.content;
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const extracted = raw.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(extracted);

    parsed.prompt = {
      system: prompt_system,
      user: prompt_user,
    };

    res.json({ success: true, insight: parsed });
  } catch (err) {
    console.error("❌ Failed to generate trend insight:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
