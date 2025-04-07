import React from "react";

export default function ChartSwitcher({ value, onChange }) {
  return (
    <label style={{ marginRight: "1rem" }}>
      Chart Type:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginLeft: "0.5rem" }}
      >
        <option value="bar">Bar</option>
        <option value="line">Line</option>
      </select>
    </label>
  );
}
