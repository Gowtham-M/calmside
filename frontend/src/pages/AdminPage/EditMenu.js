import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditMenu = () => {
  const [menus, setMenus] = useState([]); // State to hold menu items
  const [editingMenu, setEditingMenu] = useState(null); // State for the menu being edited
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [loading, setLoading] = useState(false); // Loading state for submit
  const [form] = Form.useForm();
  const { company } = useParams(); // Fetch company ID from URL params

  useEffect(() => {
    fetchMenus(); // Fetch menus on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch menus from backend
  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/admin/${company}`
      );
      setMenus(data);
    } catch (error) {
      message.error("Failed to fetch Menus");
    }
  };

  // Handle adding a new menu item
  const handleAddMenu = () => {
    setEditingMenu(null); // Reset editing menu to null for a new entry
    setIsModalVisible(true); // Show modal
  };

  // Handle editing an existing menu item
  const handleEditMenu = (record) => {
    setEditingMenu(record); // Set the record for editing
    form.setFieldsValue(record); // Populate form with record values
    setIsModalVisible(true); // Show modal
  };

  // Handle deleting a menu item (deactivate it)
  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/admin/${menuId}`,
        { isActive: false }
      );
      message.success("Menu deactivated");
      fetchMenus(); // Refresh menu list
    } catch (error) {
      message.error("Failed to deactivate Menu");
    }
  };

  // Handle activating a menu item
  const handleActivateMenu = async (menuId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/admin/${menuId}`,
        { isActive: true }
      );
      message.success("Menu activated");
      fetchMenus(); // Refresh menu list
    } catch (error) {
      message.error("Failed to activate Menu");
    }
  };

  // Submit handler for the modal form (Add/Update menu)
  const handleModalSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingMenu) {
        // If editing, update the menu item
        await axios.put(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/admin/${editingMenu._id}`,
          { ...values, company }
        );
        message.success("Menu updated successfully");
      } else {
        // If adding, create a new menu item
        await axios.post(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/admin`,
          { ...values, company }
        );
        message.success("Menu added successfully");
      }
      fetchMenus(); // Refresh menu list
      setIsModalVisible(false); // Hide modal
      form.resetFields(); // Reset form
    } catch (error) {
      message.error("Failed to save Menu details");
    } finally {
      setLoading(false);
    }
  };

  // Columns for the table
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "left",
      render: (text, record, index) => index + 1, // Display row number
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      align: "left",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "left",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "left",
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
        dataSource={menus.filter((menu) => menu.isActive)} // Filter active menus
        rowKey="_id"
      />

      <h3>Inactive Menus</h3>
      <Table
        columns={columns}
        dataSource={menus.filter((menu) => !menu.isActive)} // Filter inactive menus
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
          <Form.Item name="category" label="Category">
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

export default EditMenu;
