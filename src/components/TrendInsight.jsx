import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function TrendInsight({ keyword, items }) {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    async function analyze() {
      const res = await fetch(`${API_BASE}/api/analyze-trends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, items }),
      });
      const json = await res.json();
      setInsight(json.insight);
    }

    analyze();
  }, [keyword]);

  if (!insight) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
        💡 AI Insight (placeholder): Generating insight for{" "}
        <strong>{keyword}</strong>…
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm space-y-1">
      <p className="text-xs text-gray-500 font-mono uppercase">
        AI Insight for <strong>{keyword}</strong>
      </p>
      <h4 className="font-semibold">{insight.insight_title}</h4>
      <p>{insight.summary}</p>
      <p className="italic text-sm text-gray-600">
        Suggested action: {insight.suggested_action}
      </p>
    </div>
  );
}
