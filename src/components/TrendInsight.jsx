import React, { useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function TrendInsight({ keyword, insight }) {
  console.log("🧪 Received insight for", keyword, insight);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  if (!insight) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
        💡 AI Insight (placeholder): Generating insight for{" "}
        <strong>{keyword}</strong>…
      </div>
    );
  }

  const sendFeedback = async (rating) => {
    if (!insight) return;

    const feedbackPayload = {
      keyword,
      rating,
      insight, // Insight already includes .prompt etc.
    };

    console.log("📤 Sending feedback payload:", feedbackPayload);

    try {
      await fetch(`${API_BASE}/api/insight-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackPayload),
      });
      setFeedbackGiven(true);
    } catch (error) {
      console.error("❌ Failed to send feedback:", error);
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm space-y-2">
      <p className="text-xs text-gray-500 font-mono uppercase">
        AI Insight for <strong>{keyword}</strong>
      </p>
      <h4 className="font-semibold">{insight.insight_title}</h4>
      <p>{insight.summary}</p>

      {Array.isArray(insight.suggested_actions) &&
        insight.suggested_actions.length > 0 && (
          <ul className="list-disc pl-5">
            {insight.suggested_actions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
        )}

      <div className="pt-2 flex gap-3 text-sm">
        {!feedbackGiven ? (
          <>
            <button
              onClick={() => sendFeedback("thumbs_up")}
              className="px-2 py-1 rounded bg-green-100 hover:bg-green-200"
            >
              👍 Helpful
            </button>
            <button
              onClick={() => sendFeedback("thumbs_down")}
              className="px-2 py-1 rounded bg-red-100 hover:bg-red-200"
            >
              👎 Needs work
            </button>
          </>
        ) : (
          <p className="text-xs text-gray-500">
            ✅ Feedback submitted. Thanks!
          </p>
        )}
      </div>
    </div>
  );
}
