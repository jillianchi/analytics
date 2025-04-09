import React from "react";
import FileUploader from "./FileUploader";

export default function DataBanner({
  ordersLoaded,
  itemsLoaded,
  onOrdersParsed,
  onItemsParsed,
}) {
  return (
    <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 rounded-xl shadow flex justify-between items-center text-sm text-gray-700 mb-6">
      <div>
        <p>
          <span className="font-medium">Current Data:</span>{" "}
          {ordersLoaded ? `${ordersLoaded} orders` : "No orders file"} |{" "}
          {itemsLoaded ? `${itemsLoaded} items` : "No items file"}
        </p>
      </div>
      <FileUploader
        onOrdersParsed={onOrdersParsed}
        onItemsParsed={onItemsParsed}
      />
    </div>
  );
}
