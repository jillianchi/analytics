import React from "react";

export default function AutoInsights({ orders, items }) {
  if (!orders || !items || orders.length === 0 || items.length === 0)
    return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalValue, 0);
  const monthRevenue = {};
  const regionSales = {};
  const productSales = {};

  orders.forEach((o) => {
    const month = new Date(o.createdAt).toISOString().slice(0, 7); // yyyy-mm
    monthRevenue[month] = (monthRevenue[month] || 0) + o.totalValue;

    const region = o.region || "Unknown";
    regionSales[region] = (regionSales[region] || 0) + o.totalValue;
  });

  items.forEach((i) => {
    const name = i.productName;
    productSales[name] = (productSales[name] || 0) + i.quantity;
  });

  const sortedMonths = Object.entries(monthRevenue).sort();
  const sortedRegions = Object.entries(regionSales).sort((a, b) => b[1] - a[1]);
  const sortedProducts = Object.entries(productSales).sort(
    (a, b) => b[1] - a[1]
  );

  const [latestMonth, latestRevenue] = sortedMonths.at(-1);
  const [prevMonth, prevRevenue] = sortedMonths.at(-2) || [];
  const monthChange = prevRevenue
    ? (((latestRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
    : null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>🧐 Auto Insights</h2>
      <ul style={{ lineHeight: 1.8 }}>
        <li>
          📅 Your latest month ({latestMonth}) earned{" "}
          {latestRevenue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          {monthChange &&
            ` — a ${monthChange}% ${
              monthChange > 0 ? "increase" : "decrease"
            } from the previous month.`}
        </li>
        <li>
          🌍 Top region: <strong>{sortedRegions[0][0]}</strong> with{" "}
          {sortedRegions[0][1].toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}{" "}
          in sales.
        </li>
        <li>
          🏆 Best-selling product: <strong>{sortedProducts[0][0]}</strong> with{" "}
          {sortedProducts[0][1]} units sold.
        </li>
        <li>
          ⚖️ A total of {orders.length} orders were placed, averaging{" "}
          {(totalRevenue / orders.length).toFixed(2)} per order.
        </li>
      </ul>
    </div>
  );
}
