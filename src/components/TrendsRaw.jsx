import React, { useState, useEffect } from "react";
import { FolderSearch } from "lucide-react";
import TrendInsight from "./TrendInsight";
import PersonaManager from "./PersonaManager";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const normalizeKeyword = (k) => k.toLowerCase().trim();

const REGION_OPTIONS = [
  { label: "New Zealand", code: 2554 },
  { label: "Oman", code: 2064 },
  { label: "Germany", code: 2276 },
  { label: "United States", code: 2840 },
  { label: "Singapore", code: 2702 },
];

const TIME_RANGE_OPTIONS = [
  { label: "Past 7 days", value: "past_7_days" },
  { label: "Past 30 days", value: "past_30_days" },
  { label: "Past 90 days", value: "past_90_days" },
  { label: "Past 12 months", value: "past_12_months" },
];

export default function TrendsRaw() {
  const [trendData, setTrendData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [multiTrendData, setMultiTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(2554);
  const [timeRange, setTimeRange] = useState("past_90_days");
  const [pagination, setPagination] = useState({});
  const [insightResults, setInsightResults] = useState({});
  const [personas, setPersonas] = useState(() => {
    const saved = localStorage.getItem("ai_personas");
    return saved ? JSON.parse(saved) : [];
  });
  const [activePersona, setActivePersona] = useState(() => {
    const saved = localStorage.getItem("ai_active_persona");
    return saved ? JSON.parse(saved) : null;
  });

  const handleSavePersona = (updatedList) => {
    setPersonas(updatedList);
    const latest = updatedList[updatedList.length - 1];
    setActivePersona(latest);
    localStorage.setItem("ai_personas", JSON.stringify(updatedList));
    localStorage.setItem("ai_active_persona", JSON.stringify(latest));
  };

  useEffect(() => {
    fetch("/data/archive/google_trends/raw_trends_2025-04-17_NZ_wine.json")
      .then((res) => res.json())
      .then((json) => {
        const resultBlock = json.result?.[0];
        if (resultBlock?.items) {
          setTrendData(resultBlock.items);
          setSearchTerm(resultBlock.keywords?.[0] || "");
        } else {
          console.error("⚠️ Unexpected trend format", json);
          setTrendData([]);
        }
      })
      .catch((err) => console.error("Failed to load trends", err));
  }, []);

  const fetchTrendsForKeywords = async () => {
    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    if (keywords.length === 0) return;

    setLoading(true);
    setMultiTrendData([]);

    try {
      const res = await fetch(`${API_BASE}/api/trends/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords,
          location_code: region,
          time_range: timeRange,
        }),
      });

      const json = await res.json();
      const results = json.results || [];
      setMultiTrendData(results);

      if (results.length > 0 && results[0].items) {
        const aiRes = await fetch(`${API_BASE}/api/analyze-trends`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyword: results[0].keyword,
            items: results[0].items,
            persona: activePersona,
          }),
        });
        const aiJson = await aiRes.json();
        const key = normalizeKeyword(results[0].keyword);
        setInsightResults((prev) => ({
          ...prev,
          [key]: aiJson,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch multi-trends", err);
    } finally {
      setLoading(false);
    }
  };

  const renderTrendBlock = (title, data = [], isRising = false) => {
    const pageKey = title;
    const itemsPerPage = 5;
    const currentPage = pagination[pageKey] || 1;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="bg-white rounded-lg shadow p-4 space-y-2">
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-sm border-b pb-1 border-gray-200"
            >
              <span>{item.query || item.topic_title}</span>
              <span className="font-mono text-gray-600">
                {isRising ? `+${item.value.toLocaleString()}` : item.value}
              </span>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between pt-3 text-xs">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    [pageKey]: Math.max(1, currentPage - 1),
                  }))
                }
                disabled={currentPage === 1}
                className="px-2 py-1 mr-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
              >
                ← Prev
              </button>

              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          [pageKey]: pageNum,
                        }))
                      }
                      className={`px-2 py-1 rounded ${
                        pageNum === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    [pageKey]: Math.min(totalPages, currentPage + 1),
                  }))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 ml-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-10 space-y-8">
      <PersonaManager
        personas={personas}
        onSave={handleSavePersona}
        activePersona={activePersona}
        setActivePersona={setActivePersona}
      />

      <h2 className="text-2xl font-bold text-gray-700">
        📊 Raw Trend Explorer
      </h2>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="e.g. wine, fashion, diy"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
          className="border rounded-lg px-3 py-1 w-80 text-sm"
        />

        <select
          value={region}
          onChange={(e) => setRegion(Number(e.target.value))}
          className="border rounded-lg px-3 py-1 text-sm"
        >
          {REGION_OPTIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.label}
            </option>
          ))}
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm"
        >
          {TIME_RANGE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          onClick={fetchTrendsForKeywords}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm disabled:opacity-50"
        >
          Search Trends
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm p-10 flex flex-col items-center gap-3">
          <FolderSearch className="w-6 h-6 animate-spin" />
          <p className="font-medium">Fetching latest Google Trends…</p>
          <p className="text-xs text-gray-400">This may take 5–10 seconds</p>
        </div>
      ) : multiTrendData.length > 0 ? (
        multiTrendData.map((entry, i) => {
          const key = normalizeKeyword(entry.keyword); // 👈 add this line here
          return (
            <div key={i} className="space-y-4 mt-8">
              <p className="text-sm text-gray-500 mb-2">
                Showing trend data for:{" "}
                <span className="font-semibold text-gray-700">
                  {entry.keyword}
                </span>
              </p>
              <TrendInsight
                keyword={entry.keyword}
                insight={insightResults[key]?.insight} // 👈 use the normalized key
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderTrendBlock(
                  "Top Queries",
                  entry.items.find(
                    (i) => i.type === "google_trends_queries_list"
                  )?.data?.top
                )}
                {renderTrendBlock(
                  "Rising Queries",
                  entry.items.find(
                    (i) => i.type === "google_trends_queries_list"
                  )?.data?.rising,
                  true
                )}
                {renderTrendBlock(
                  "Top Topics",
                  entry.items.find(
                    (i) => i.type === "google_trends_topics_list"
                  )?.data?.top
                )}
                {renderTrendBlock(
                  "Rising Topics",
                  entry.items.find(
                    (i) => i.type === "google_trends_topics_list"
                  )?.data?.rising,
                  true
                )}
              </div>
            </div>
          );
        })
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2">
            Showing trend data for:{" "}
            <span className="font-semibold text-gray-700">{searchTerm}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderTrendBlock(
              "Top Queries",
              trendData?.find(
                (item) => item.type === "google_trends_queries_list"
              )?.data?.top
            )}
            {renderTrendBlock(
              "Rising Queries",
              trendData?.find(
                (item) => item.type === "google_trends_queries_list"
              )?.data?.rising,
              true
            )}
            {renderTrendBlock(
              "Top Topics",
              trendData?.find(
                (item) => item.type === "google_trends_topics_list"
              )?.data?.top
            )}
            {renderTrendBlock(
              "Rising Topics",
              trendData?.find(
                (item) => item.type === "google_trends_topics_list"
              )?.data?.rising,
              true
            )}
          </div>
        </>
      )}
    </div>
  );
}
