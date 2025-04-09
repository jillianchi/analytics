import React, { useState, useEffect } from "react";
import FileUploader from "./components/FileUploader";
import RevenueChart from "./components/RevenueChart";
import TopProductsChart from "./components/TopProductsChart";
import KPICards from "./components/KPICards";
import AIHighlights from "./components/AIHighlights";
import SmartQA from "./components/SmartQA";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

function DataBanner({
  ordersLoaded,
  itemsLoaded,
  uploadTriggered,
  ordersFilename,
  itemsFilename,
  onOrdersParsed,
  onItemsParsed,
  onOrdersFilename,
  onItemsFilename,
}) {
  const isReady =
    uploadTriggered && Number(ordersLoaded) > 0 && Number(itemsLoaded) > 0;

  return (
    <div className="w-full bg-blue-600 text-white px-6 text-sm flex justify-between items-center h-16 relative">
      {/* Left side: message */}
      <div className="font-medium tracking-wide">
        {isReady
          ? `Data Source: ${
              ordersFilename || "orders.csv"
            } (${ordersLoaded} orders, ${itemsLoaded} items)`
          : "📂 Upload your order and item CSVs to begin."}
      </div>

      {/* Uploader */}
      <div className="flex items-center z-10">
        <FileUploader
          onOrdersParsed={onOrdersParsed}
          onOrdersFilename={onOrdersFilename}
          onItemsParsed={onItemsParsed}
          onItemsFilename={onItemsFilename}
        />
      </div>

      {/* Full-height status block on far right */}
      <div
        className={`absolute top-0 right-0 h-full w-12 flex items-center justify-center transition-colors duration-500 ${
          isReady ? "bg-green-500 animate-pulse-glow" : "bg-blue-600"
        }`}
      >
        <CheckCircle className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

export default function App() {
  const [ordersData, setOrdersData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(null);
  const [itemsLoaded, setItemsLoaded] = useState(null);
  const [ordersFilename, setOrdersFilename] = useState(null);
  const [itemsFilename, setItemsFilename] = useState(null);
  const [uploadTriggered, setUploadTriggered] = useState(false);
  const [productChartType, setProductChartType] = useState("bar");
  const [revenueChartType, setRevenueChartType] = useState("line");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const savedOrders = localStorage.getItem("ordersData");
    const savedItems = localStorage.getItem("itemsData");
    if (savedOrders) {
      setOrdersData(JSON.parse(savedOrders));
      setOrdersLoaded(JSON.parse(savedOrders).length);
    }
    if (savedItems) {
      setItemsData(JSON.parse(savedItems));
      setItemsLoaded(JSON.parse(savedItems).length);
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
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex">
      {/* Sidebar */}
      <aside className="group relative w-20 hover:w-64 transition-all duration-300 bg-white border-r min-h-screen p-4 space-y-4 overflow-hidden">
        <h1 className="text-xl font-bold mb-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
          🤖 AnalyticsAI
        </h1>
        <nav className="space-y-2">
          <button
            className={`flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-100 transition ${
              activeTab === "dashboard" ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="w-5 h-5 mr-2 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
              Dashboard
            </span>
          </button>

          <button
            className={`flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-100 transition ${
              activeTab === "charts" ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("charts")}
          >
            <BarChart3 className="w-5 h-5 mr-2 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
              Charts
            </span>
          </button>

          <button
            className={`flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-100 transition ${
              activeTab === "ai" ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("ai")}
          >
            <MessageSquare className="w-5 h-5 mr-2 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
              AI Assistant
            </span>
          </button>

          <button
            className={`flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-100 transition ${
              activeTab === "upload" ? "bg-gray-200 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("upload")}
          >
            <FileText className="w-5 h-5 mr-2 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
              Upload
            </span>
          </button>
        </nav>
      </aside>

      {/* Right side layout container */}
      <div className="flex-1">
        <DataBanner
          ordersLoaded={ordersLoaded}
          itemsLoaded={itemsLoaded}
          ordersFilename={ordersFilename}
          itemsFilename={itemsFilename}
          uploadTriggered={uploadTriggered}
          onOrdersFilename={setOrdersFilename}
          onItemsFilename={setItemsFilename}
          onOrdersParsed={(data) => {
            setOrdersData(data);
            setOrdersLoaded(data.length);

            setUploadTriggered(true);
          }}
          onItemsParsed={(data) => {
            setItemsData(data);
            setItemsLoaded(data.length);

            setUploadTriggered(true);
          }}
        />

        <main className="px-10 pb-10 pt-8 space-y-8">
          {activeTab === "dashboard" && (
            <section className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <KPICards orders={ordersData} />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <AIHighlights orders={ordersData} items={itemsData} />
              </div>
            </section>
          )}

          {activeTab === "charts" && (
            <section className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Revenue Over Time
                </h2>
                <RevenueChart
                  data={revenueData}
                  chartType={revenueChartType}
                  onChartTypeChange={setRevenueChartType}
                />
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Top Products
                </h2>
                <TopProductsChart
                  data={productSales}
                  chartType={productChartType}
                  onChartTypeChange={setProductChartType}
                />
              </div>
            </section>
          )}

          {activeTab === "ai" && (
            <section className="bg-white rounded-2xl shadow-md p-6">
              <SmartQA orders={ordersData} items={itemsData} />
            </section>
          )}

          {activeTab === "upload" && (
            <div className="text-gray-500 text-sm italic">
              Upload files using the top banner ⬆️
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
