import { useEffect, useState } from "react";

export default function Trends() {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    fetch("/insights.json")
      .then((res) => res.json())
      .then(setTrends);
  }, []);

  const formatTimestamp = (ts) => {
    if (!ts) return "Unknown date";
    try {
      const date = new Date(ts);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const isHighConfidence = (trend) => {
    const hasMultipleSources = trend.evidence?.length >= 2;
    const isRecent =
      trend.fetched_at &&
      new Date() - new Date(trend.fetched_at) < 1000 * 60 * 60 * 24 * 7;
    const hasQuantQuote = trend.evidence?.some((e) =>
      /\d+%|\$\d+|\d+(?:,\d{3})+/.test(e.quote)
    );
    return hasMultipleSources && (isRecent || hasQuantQuote);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {trends.map((trend, index) => (
        <div key={index} className="bg-white rounded-2xl shadow p-6">
          {/* 📈 High Confidence badge */}
          {isHighConfidence(trend) && (
            <div className="relative group inline-block mb-2">
              <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium cursor-help">
                📈 High Confidence
              </span>
              <div className="absolute left-0 top-full mt-1 z-10 w-64 bg-white text-gray-700 text-xs rounded shadow-lg p-3 border opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Metric based on recent data and quantitative evidence (e.g. %
                growth, $ value).
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 mb-1">
            📍 {trend.region} • 🗂 {trend.category}
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {trend.insight_title || "No title"}
          </h3>

          <p className="text-sm text-gray-700 mb-3">
            {trend.insight_summary || "No summary available."}
          </p>

          {trend.evidence && trend.evidence.length > 0 && (
            <details className="text-sm mt-3">
              <summary className="cursor-pointer text-blue-500 hover:underline">
                📚 {trend.evidence[0].source}
                {trend.evidence.length > 1 && (
                  <span className="text-gray-400">
                    {" "}
                    + {trend.evidence.length - 1} more
                  </span>
                )}
              </summary>
              <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
                {trend.evidence.map((src, idx) => (
                  <li key={idx}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {src.source}
                    </a>{" "}
                    <span className="text-gray-400 text-xs">“{src.quote}”</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {trend.suggested_action && (
            <div className="text-sm text-green-700 mt-3 font-medium">
              ✅ {trend.suggested_action}
            </div>
          )}

          <div className="text-xs text-gray-400 mt-2">
            🕒 {formatTimestamp(trend.fetched_at)}
          </div>
        </div>
      ))}
    </div>
  );
}
