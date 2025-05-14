import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

router.post("/", async (req, res) => {
  const { keyword, rating, insight } = req.body;

  if (!keyword || !rating || !insight) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const { error } = await supabase.from("insight_feedback").insert([
    { keyword, rating, insight }
  ]);

  if (error) {
    console.error("❌ Supabase insert error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }

  res.status(200).json({ success: true });
});

export default router;