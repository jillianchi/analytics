import React from "react";
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
import ChartSwitcher from "./ChartSwitcher";

export default function TopProductsChart({
  data,
  chartType,
  onChartTypeChange,
}) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <h2>🏆 Top-Selling Products</h2>

      <ChartSwitcher value={chartType} onChange={onChartTypeChange} />

      {chartType === "bar" ? (
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#82ca9d" />
        </BarChart>
      ) : (
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      )}
    </div>
  );
}
