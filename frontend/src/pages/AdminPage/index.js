import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "antd";
import { Line } from "react-chartjs-2";
import "./AdminPage.css";

const AdminPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [salesData, setSalesData] = useState({});

  useEffect(() => {
    axios
      .get("/api/admin/menu")
      .then((response) => setMenuItems(response.data));
    axios
      .get("/api/admin/analytics")
      .then((response) => setSalesData(response.data));
  }, []);

  const columns = [
    { title: "Item", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    { title: "Actions", render: (text, record) => <Button>Edit</Button> },
  ];

  const data = {
    labels: salesData.labels,
    datasets: [{ label: "Sales", data: salesData.values }],
  };

  return (
    <div>
      <h2>Menu Management</h2>
      <Table dataSource={menuItems} columns={columns} />
      <h2>Sales Analytics</h2>
      <Line data={data} />
    </div>
  );
};

export default AdminPage;
