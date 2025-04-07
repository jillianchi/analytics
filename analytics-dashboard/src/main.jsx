import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function App() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const chartData = results.data
          .filter(row => row.createdAt && row.totalValue)
          .map(row => ({
            date: row.createdAt,
            revenue: parseFloat(row.totalValue)
          }));
        setData(chartData);
      }
    });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>📊 VTEX Sales Dashboard</h1>
      <p>Upload your <code>orders.csv</code> file:</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <br /><br />
      {data.length > 0 && (
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
        </LineChart>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
