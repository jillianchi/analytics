import React, { useState } from "react";

export default function SmartQA({ orders, items }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch("https://jillian.vercel.app//api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, orders, items }),
      });

      const data = await res.json();
      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer("Sorry, I couldn't generate a response.");
      }
    } catch (err) {
      console.error("AI fetch error:", err);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>💬 Ask the Assistant</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. What is my best-selling product?"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        style={{ padding: "0.5rem 1rem" }}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {answer && (
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>{answer}</p>
      )}
    </div>
  );
}
