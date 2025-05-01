// services/promptBuilder.js

export function buildUserPrompt(keyword, items) {
  const queries =
    items.find((i) => i.type === "google_trends_queries_list")?.data?.rising ||
    [];
  const topics =
    items.find((i) => i.type === "google_trends_topics_list")?.data?.rising ||
    [];

  const risingQueries = queries
    .slice(0, 5)
    .map((q) => `- "${q.query}" (+${q.value})`)
    .join("\n");

  const risingTopics = topics
    .slice(0, 5)
    .map((t) => `- "${t.topic_title}" (+${t.value})`)
    .join("\n");

  return `You are a senior growth strategist.

Using the data below, analyze the rising Google Trends for the keyword **"${keyword}"**.

Your task:
1. Identify 1–2 **key emerging themes**
2. Provide **one strategic insight** by connecting patterns between queries and topics
3. List **3 actionable recommendations** tailored to the persona and organization context

---

📈 Rising Queries:
${risingQueries || "- (no data found)"}

📊 Rising Topics:
${risingTopics || "- (no data found)"}

---

Respond strictly in this JSON format:

{
  "keyword": "${keyword}",
  "insight_title": "Your insight title here",
  "summary": "Short paragraph summary of the trend insight.",
  "suggested_actions": [
    "First action point — clear and persona-aligned.",
    "Second action point — strategic or tactical step.",
    "Third action point — if applicable."
  ]
}

Do not include explanations outside of this JSON object.`;
}

export function buildSystemMessage(persona, org) {
  if (!persona)
    return "You are an AI assistant generating strategic e-commerce insights.";

  return `You generate strategic insights for e-commerce teams based on persona and organization context.

🔑 Always tailor insights and action steps based on:
1. The user's role, tone, and goals
2. The brand’s values, audience, and business priorities

👤 Persona:
- Name: ${persona.name}
- Role: ${persona.description}
- Goals: ${persona.goals}
- Influence: ${persona.scope}
- Tone: ${persona.tone || "neutral"}

🏢 Organization:
- Name: ${org.name}
- Description: ${org.description}
- Values: ${org.brandValues.join(", ")}
- Audience: ${org.targetAudience.join(", ")}
- Goals: ${org.businessGoals.join(", ")}
`;
}
