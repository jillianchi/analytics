import React, { useEffect, useState } from "react";

export default function AIHighlights({ orders, items }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!orders || !items || orders.length === 0 || items.length === 0) return;

    // Simulated GPT call — replace with real API call in future
    const simulatedInsights = generateAIInsights(orders, items);
    setInsights(simulatedInsights);
  }, [orders, items]);

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm animate-fade-in">
      <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
        🤖 AI Highlights
      </h2>
      <ul className="space-y-3 text-sm text-gray-700 list-disc list-inside">
        {insights.map((insight, idx) => (
          <li key={idx}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}

function generateAIInsights(orders, items) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalValue, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalRevenue / totalOrders;

  const regionMap = {};
  orders.forEach((o) => {
    const region = o.region || "Unknown";
    regionMap[region] = (regionMap[region] || 0) + o.totalValue;
  });
  const topRegion = Object.entries(regionMap).sort((a, b) => b[1] - a[1])[0];

  const productMap = {};
  items.forEach((i) => {
    productMap[i.productName] = (productMap[i.productName] || 0) + i.quantity;
  });
  const topProduct = Object.entries(productMap).sort((a, b) => b[1] - a[1])[0];

  return [
    `Your store generated ${totalRevenue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })} in total revenue across ${totalOrders} orders.`,
    `Your average order value is ${avgOrderValue.toFixed(
      2
    )} — consider bundling strategies to increase it further.`,
    `The top-performing region was ${
      topRegion[0]
    }, contributing ${topRegion[1].toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })} in revenue.`,
    `Your best-selling product was "${topProduct[0]}" with ${topProduct[1]} units sold.`,
    `You can ask the assistant follow-up questions below for deeper insights.`,
  ];
}
