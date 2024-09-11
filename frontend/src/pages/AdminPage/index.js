import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Form,  message } from 'antd';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './AdminPage.css';

const AdminPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [form] = Form.useForm();

  const company = window.location.pathname.split('/')[2]; // Extract company from URL path

  useEffect(() => {
    axios.get(`/api/admin/menu/${company}`).then((response) => {
      setMenuItems(response.data);
    });
    axios.get(`/api/admin/analytics/${company}`).then((response) => {
      setAnalyticsData(response.data);
    });
  }, [company]);

  const handleEditMenu = (values) => {
    axios.post(`/api/admin/menu/${company}`, values).then(() => {
      message.success('Menu updated successfully');
    });
  };

  const columns = [
    { title: 'Item Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
  ];

  return (
    <div className="admin-page">
      <h2>Edit Menu Items</h2>
      <Form form={form} onFinish={handleEditMenu} layout="vertical">
        <Table dataSource={menuItems} columns={columns} rowKey="_id" />

        <Form.Item label="Item Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Price" name="price">
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form>

      <h2>Sales Analytics</h2>
      <Line
        data={{
          labels: analyticsData.days,
          datasets: [
            {
              label: 'Items Sold',
              data: analyticsData.itemsSold,
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
          ],
        }}
      />
    </div>
  );
};

export default AdminPage;
