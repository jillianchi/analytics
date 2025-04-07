import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ChartSwitcher from "./ChartSwitcher";

export default function RevenueChart({ data, chartType, onChartTypeChange }) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <h2>💰 Revenue Over Time</h2>

      <ChartSwitcher value={chartType} onChange={onChartTypeChange} />

      <LineChart width={600} height={300} data={data}>
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
    </div>
  );
}
