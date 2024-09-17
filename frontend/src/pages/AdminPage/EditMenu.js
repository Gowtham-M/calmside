import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EditMenu.css";

const EditMenu = () => {
  const [menus, setMenus] = useState([]); // State to hold menu items
  const [editingMenu, setEditingMenu] = useState(null); // State for the menu being edited
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [loading, setLoading] = useState(false); // Loading state for submit
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
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
    setImageUrl(""); // Clear image URL
    form.resetFields(); // Reset form fields to clear any previous values
    setIsModalVisible(true); // Show modal
  };

  // Handle editing an existing menu item
  const handleEditMenu = (record) => {
    setEditingMenu(record); // Set the record for editing
    form.setFieldsValue(record); // Populate form with record values
    setImageUrl(record.imageUrl || "");
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
          { ...values, imageUrl, company }
        );
        message.success("Menu updated successfully");
      } else {
        // If adding, create a new menu item
        await axios.post(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/admin`,
          { ...values, imageUrl, company }
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

  // Handle file upload
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("images", file); // Field name should match the backend

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/menu/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onSuccess(data); // Notify the Upload component
      setImageUrl((prev) => [...prev, ...data.imageUrls]); // Update image URLs in the state
      message.success("Images uploaded successfully");
    } catch (error) {
      console.error("File upload failed:", error);
      onError(error); // Notify the Upload component
      message.error("Failed to upload images");
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
      title: "Type", //  column for Veg/Non-Veg
      dataIndex: "type",
      key: "type",
      align: "left",
      render: (text) => (text === "veg" ? "Veg" : "Non-Veg"), // Display the type text
    },
    {
      title: "Image",
      key: "image",
      render: (text, record) =>
        record.imageUrl ? (
          <img
            src={`${process.env.REACT_APP_BACKEND_API_URL}${record?.imageUrl[0]}`}
            alt="menu"
            style={{ width: 100 }}
          />
        ) : null,
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

  // Validation for item name and category
  const textValidator = (_, value) => {
    const textRegex = /^(?!^\d+$)[a-zA-Z0-9\s]+$/; // Prevents only numbers
    if (value && !textRegex.test(value)) {
      return Promise.reject(
        "Input must contain letters or alphanumeric characters."
      );
    }
    return Promise.resolve();
  };

  // Validation for price
  const priceValidator = (_, value) => {
    const priceRegex = /^\d+(\.\d{1,2})?$/; // Allows numbers and optional 2 decimal places
    if (value && !priceRegex.test(value)) {
      return Promise.reject("Price must be a valid number.");
    }
    return Promise.resolve();
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
        dataSource={menus.filter((menu) => menu.isActive)} // Filter active menus
        rowKey="_id"
        locale={{ emptyText: "No Active Menus" }}
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
            rules={[
              { required: true, message: "Please enter the item name" },
              { validator: textValidator },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[
              { required: true, message: "Please enter the category" },
              { validator: textValidator },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter the price" },
              { validator: priceValidator },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type" // Dropdown for Veg/Non-Veg
            rules={[{ required: true, message: "Please select the type" }]}
          >
            <Select placeholder="Select Type">
              <Select.Option value="veg">Veg</Select.Option>
              <Select.Option value="non-veg">Non-Veg</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="images" label="Images">
            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              accept="image/*"
              multiple // Enable multiple file selection
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
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
