import React, { useState } from "react";
import Papa from "papaparse";

export default function FileUploader({
  onOrdersParsed,
  onItemsParsed,
  onOrdersFilename,
  onItemsFilename,
}) {
  const [isParsing, setIsParsing] = useState(false);

  const handleUnifiedUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);

    // Send file name to parent
    if (onOrdersFilename) onOrdersFilename(file.name);
    if (onItemsFilename) onItemsFilename(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
      complete: (results) => {
        const rows = results.data;

        const orderMap = {};
        const itemsParsed = [];

        rows.forEach((row) => {
          const orderId = row["Order"];
          if (!orderMap[orderId]) {
            orderMap[orderId] = {
              orderId,
              createdAt: row["Creation Date"],
              totalValue: parseFloat(row["Total Value"] || 0),
              region: row["UF"] || row["City"] || "Unknown",
              salesChannel: row["SalesChannel"] || "Unknown",
            };
          }

          itemsParsed.push({
            orderId,
            productName: row["SKU Name"],
            quantity: parseInt(row["Quantity_SKU"] || 0),
            price: parseFloat(row["SKU Selling Price"] || 0),
            totalPrice: parseFloat(row["SKU Total Price"] || 0),
            promotion: row["Promo Info"] || "",
          });
        });

        const ordersParsed = Object.values(orderMap);

        onOrdersParsed(ordersParsed);
        onItemsParsed(itemsParsed);

        localStorage.setItem("ordersData", JSON.stringify(ordersParsed));
        localStorage.setItem("itemsData", JSON.stringify(itemsParsed));

        setIsParsing(false);

        console.log("✅ Orders parsed:", ordersParsed);
        console.log("✅ Items parsed:", itemsParsed);
      },
    });
  };

  return (
    <div>
      <p>Upload your unified VTEX export:</p>
      <input type="file" accept=".csv" onChange={handleUnifiedUpload} />
      {isParsing && <p className="text-blue-600 mt-2">⏳ Parsing...</p>}
    </div>
  );
}
