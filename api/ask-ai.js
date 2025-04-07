import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, orders, items } = req.body;

  if (!question || !orders || !items) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  console.log("Incoming question:", question);
  console.log("Orders received:", orders.length);
  console.log("Items received:", items.length);

  try {
    const summary = `Here is a summary of the store's sales data:
- Orders: ${orders.length}
- Total revenue: $${orders.reduce((sum, o) => sum + o.totalValue, 0).toFixed(2)}
- Example products: ${[
      ...new Set(items.slice(0, 3).map((i) => i.productName)),
    ].join(", ")}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an e-commerce data analyst. Answer user questions using the provided store data.",
        },
        {
          role: "user",
          content: `${summary}

Question: ${question}`,
        },
      ],
    });

    const answer = response.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (err) {
    console.error("OpenAI Error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate response." });
  }
}
