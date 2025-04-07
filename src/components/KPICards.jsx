import React from "react";

export default function KPICards({ orders }) {
  if (!orders || orders.length === 0) return null;

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalValue, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalRevenue / totalOrders;

  const format = (num) =>
    num.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
      <div style={cardStyle}>
        <h3>💰 Total Revenue</h3>
        <p>{format(totalRevenue)}</p>
      </div>
      <div style={cardStyle}>
        <h3>📦 Total Orders</h3>
        <p>{totalOrders}</p>
      </div>
      <div style={cardStyle}>
        <h3>📊 Avg. Order Value</h3>
        <p>{format(avgOrderValue)}</p>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#f4f4f4",
  padding: "1rem 2rem",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  flex: "1",
  textAlign: "center",
};
