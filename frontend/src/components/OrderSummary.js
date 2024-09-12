import React from "react";
import { Table } from "antd";

const OrderSummary = ({ selectedItems, totalAmount }) => {
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "left",
      render: (text, record, index) => index + 1,
    },
    { title: "Item", dataIndex: "name", align: "left" },
    { title: "Quantity", dataIndex: "quantity", align: "left" },
    { title: "Price", dataIndex: "price", align: "left" },
    {
      title: "Total",
      align: "left",
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
