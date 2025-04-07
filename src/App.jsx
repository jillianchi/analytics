import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import FileUploader from "./components/FileUploader";
import RevenueChart from "./components/RevenueChart";
import TopProductsChart from "./components/TopProductsChart";
import KPICards from "./components/KPICards";
import AIHighlights from "./components/AIHighlights";
import SmartQA from "./components/SmartQA";

export default function App() {
  const [ordersData, setOrdersData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(null);
  const [itemsLoaded, setItemsLoaded] = useState(null);
  const [productChartType, setProductChartType] = useState("bar");
  const [revenueChartType, setRevenueChartType] = useState("line");

  useEffect(() => {
    const savedOrders = localStorage.getItem("ordersData");
    const savedItems = localStorage.getItem("itemsData");
    if (savedOrders) {
      const parsed = JSON.parse(savedOrders);
      setOrdersData(parsed);
      setOrdersLoaded(parsed.length);
    }
    if (savedItems) {
      const parsed = JSON.parse(savedItems);
      setItemsData(parsed);
      setItemsLoaded(parsed.length);
    }
  }, []);

  const revenueData = ordersData.map((row) => ({
    date: row.createdAt,
    revenue: row.totalValue,
  }));

  const productSales = Object.values(
    itemsData.reduce((acc, item) => {
      const name = item.productName;
      if (!acc[name]) {
        acc[name] = { productName: name, quantity: 0 };
      }
      acc[name].quantity += item.quantity;
      return acc;
    }, {})
  )
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>📊 Analytics Dashboard</h1>

      <KPICards orders={ordersData} />

      <AIHighlights orders={ordersData} items={itemsData} />

      <SmartQA orders={ordersData} items={itemsData} />

      <FileUploader
        onOrdersParsed={(data) => {
          setOrdersData(data);
          setOrdersLoaded(data.length);
        }}
        onItemsParsed={(data) => {
          setItemsData(data);
          setItemsLoaded(data.length);
        }}
      />

      {ordersLoaded !== null && (
        <p style={{ color: "green" }}>
          ✅ Orders file loaded ({ordersLoaded} entries)
        </p>
      )}
      {itemsLoaded !== null && (
        <p style={{ color: "green" }}>
          ✅ Items file loaded ({itemsLoaded} entries)
        </p>
      )}

      <br />
      <br />

      <RevenueChart
        data={revenueData}
        chartType={revenueChartType}
        onChartTypeChange={setRevenueChartType}
      />

      <br />

      <TopProductsChart
        data={productSales}
        chartType={productChartType}
        onChartTypeChange={setProductChartType}
      />
    </div>
  );
}
