import React from "react";
import { Table, InputNumber } from "antd";

const MenuTable = ({ menuItems, addToOrder }) => {
  const columns = [
    { title: "Item Name", dataIndex: "name", key: "name", align: "left" },
    { title: "Price", dataIndex: "price", key: "price", align: "left" },
    {
      title: "Quantity",
      key: "quantity",
      align: "left",
      render: (_, record) => (
        <InputNumber
          min={0}
          defaultValue={0}
          onChange={(value) => addToOrder(record, value)}
        />
      ),
    },
  ];

  return <Table dataSource={menuItems} columns={columns} rowKey="_id" />;
};

export default MenuTable;
