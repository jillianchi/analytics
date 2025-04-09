import React from "react";

export default function KPICards({ orders }) {
  if (!orders || orders.length === 0) return null;

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalValue, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalRevenue / totalOrders;

  const format = (num) =>
    num.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl shadow-md text-center">
        <h3 className="text-sm text-gray-500 uppercase">💰 Total Revenue</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {format(totalRevenue)}
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl shadow-md text-center">
        <h3 className="text-sm text-gray-500 uppercase">📦 Total Orders</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">{totalOrders}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl shadow-md text-center">
        <h3 className="text-sm text-gray-500 uppercase">📊 Avg. Order Value</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {format(avgOrderValue)}
        </p>
      </div>
    </div>
  );
}
