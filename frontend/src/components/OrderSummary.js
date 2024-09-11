import React from "react";
import { Table } from "antd";

const OrderSummary = ({ selectedItems, totalAmount }) => {
  const columns = [
    { title: "Item", dataIndex: "name" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Price", dataIndex: "price" },
    {
      title: "Total",
      render: (text, record) => record.quantity * record.price,
    },
  ];

  const data = selectedItems.map((item) => ({
    key: item._id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  return (
    <div>
      <Table dataSource={data} columns={columns} pagination={false} />
      <h3>Total Amount: {totalAmount}</h3>
    </div>
  );
};

export default OrderSummary;
