import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const [ordersData, setOrdersData] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  const handleOrdersUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.filter(
          (row) => row.createdAt && row.totalValue
        );
        setOrdersData(parsed);
        console.log("✅ Orders loaded", parsed);
      },
    });
  };

  const handleItemsUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.filter(
          (row) => row.sku && row.productName
        );
        setItemsData(parsed);
        console.log("✅ Items loaded", parsed);
      },
    });
  };

  const revenueData = ordersData.map((row) => ({
    date: row.createdAt,
    revenue: parseFloat(row.totalValue),
  }));

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>📊 VTEX Sales Dashboard</h1>

      <p>Upload your <code>orders.csv</code> file:</p>
      <input type="file" accept=".csv" onChange={handleOrdersUpload} />

      <p style={{ marginTop: "1rem" }}>
        Upload your <code>items.csv</code> file:
      </p>
      <input type="file" accept=".csv" onChange={handleItemsUpload} />

      <br /><br />
      {revenueData.length > 0 && (
        <>
          <h2>💰 Revenue Over Time</h2>
          <LineChart width={600} height={300} data={revenueData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);