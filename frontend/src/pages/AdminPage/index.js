// admin should be able to
// edit menu
// check for analytics of the sales
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  const [menus, setMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/admin/${
          window.location.pathname.split("/")[2]
        }`
      );

      setMenus(data);
    } catch (error) {
      message.error("Failed to fetch Menus");
    }
  };

  const handleAddMenu = () => {
    setEditingMenu(null);
    setIsModalVisible(true);
  };

  const handleEditMenu = (record) => {
    setEditingMenu(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/${menuId}`,
        { isActive: false }
      );
      message.success("Menu deactivated");
      fetchMenus();
    } catch (error) {
      message.error("Failed to deactivate Menu");
    }
  };

  const handleActivateMenu = async (menuId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/${menuId}`,
        { isActive: true }
      );
      message.success("Menu activated");
      fetchMenus();
    } catch (error) {
      message.error("Failed to activate Menu");
    }
  };

  const handleModalSubmit = async (values) => {
    setLoading(true);
    const company = window.location.pathname.split("/")[2];
    try {
      if (editingMenu) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/${editingMenu._id}`,
          { ...values, company }, // Send as JSON
          {
            headers: {
              "Content-Type": "application/json", // Ensure Content-Type is application/json
            },
          }
        );
        message.success("Menu updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/admin`,
          { ...values, company }, // Send as JSON
          {
            headers: {
              "Content-Type": "application/json", // Ensure Content-Type is application/json
            },
          }
        );
        message.success("Menu added successfully");
      }
      fetchMenus();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save Menu details");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      render: (text, record) => (
        <Button type="link" onClick={() => handleViewMenuDetails(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditMenu(record)}
          />
          {record.isActive ? (
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteMenu(record._id)}
            />
          ) : (
            <Button
              type="primary"
              onClick={() => handleActivateMenu(record._id)}
            >
              Activate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleViewMenuDetails = (record) => {
    navigate(`/menu/${record._id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Menu Management</h2>
        <Button type="primary" onClick={handleAddMenu}>
          Add Menu
        </Button>
      </div>

      <h3>Active Menus</h3>
      <Table
        columns={columns}
        dataSource={menus.filter((menu) => menu.isActive)}
        rowKey="_id"
      />

      <h3>Inactive Menus</h3>
      <Table
        columns={columns}
        dataSource={menus.filter((menu) => !menu.isActive)}
        rowKey="_id"
      />

      <Modal
        title={editingMenu ? "Edit Menu" : "Add Menu"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleModalSubmit} layout="vertical">
          <Form.Item
            name="itemName"
            label="Item Name"
            rules={[{ required: true, message: "Please enter the item name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[
              { required: true, message: "Please enter the category name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "end" }}>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingMenu ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
