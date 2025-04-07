import React from "react";
import Papa from "papaparse";

export default function FileUploader({ onOrdersParsed, onItemsParsed }) {
  const handleOrdersUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
          .filter((row) => row.creationdate && row.value)
          .map((row) => ({
            orderId: row.orderid,
            createdAt: row.creationdate,
            totalValue: parseFloat(row.value),
            region: row.shippingdata_address_state,
            salesChannel: row.saleschannel,
          }));
        onOrdersParsed(parsed);
        localStorage.setItem("ordersData", JSON.stringify(parsed));
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
        const parsed = results.data
          .filter((row) => row.orderid && row.name)
          .map((row) => ({
            orderId: row.orderid,
            productName: row.name,
            quantity: parseInt(row.quantity),
            price: parseFloat(row.selling_price),
            totalPrice: parseFloat(row.total_price),
            promotion: row.promotion_applied,
          }));
        onItemsParsed(parsed);
        localStorage.setItem("itemsData", JSON.stringify(parsed));
        console.log("✅ Items loaded", parsed);
      },
    });
  };

  return (
    <div>
      <p>
        Upload your <code>vtex-order-list.csv</code>:
      </p>
      <input type="file" accept=".csv" onChange={handleOrdersUpload} />

      <p style={{ marginTop: "1rem" }}>
        Upload your <code>vtex-item-list.csv</code>:
      </p>
      <input type="file" accept=".csv" onChange={handleItemsUpload} />
    </div>
  );
}
