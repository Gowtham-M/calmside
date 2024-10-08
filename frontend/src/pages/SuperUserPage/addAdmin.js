import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AdminManagement.css";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { company } = useParams();

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/companies/admins/${company}`
      );
      setAdmins(data);
    } catch (error) {
      message.error("Failed to fetch Admins");
    }
  };

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setIsModalVisible(true);
  };

  const handleEditAdmin = (record) => {
    setEditingAdmin(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/companies/admins/${adminId}`,
        { isActive: false }
      );
      message.success("Admin deactivated");
      fetchAdmins();
    } catch (error) {
      message.error("Failed to deactivate Admin");
    }
  };

  const handleActivateAdmin = async (adminId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/companies/admins/${adminId}`,
        { isActive: true }
      );
      message.success("Admin activated");
      fetchAdmins();
    } catch (error) {
      message.error("Failed to activate Admin");
    }
  };

  const handleModalSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingAdmin) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/companies/admins/${editingAdmin._id}`,
          { ...values, company }
        );
        message.success("Admin updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/companies/admins`,
          { ...values, company }
        );
        message.success("Admin added successfully");
      }
      fetchAdmins();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save Admin details");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "left",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Admin Name",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phoneNumber",
      align: "left",
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
      align: "left",
    },
    {
      title: "Actions",
      key: "actions",
      align: "left",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditAdmin(record)}
          />
          {record.isActive ? (
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteAdmin(record._id)}
            />
          ) : (
            <Button
              type="primary"
              onClick={() => handleActivateAdmin(record._id)}
            >
              Activate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-management-container">
      <div className="header-container">
        <h2>Admin Management</h2>
        <Button type="primary" onClick={handleAddAdmin}>
          Add Admin
        </Button>
      </div>

      <h3>Active Admins</h3>
      <Table
        columns={columns}
        dataSource={admins.filter((admin) => admin.isActive)}
        rowKey="_id"
      />

      <h3>Inactive Admins</h3>
      <Table
        columns={columns}
        dataSource={admins.filter((admin) => !admin.isActive)}
        rowKey="_id"
      />

      <Modal
        title={editingAdmin ? "Edit Admin" : "Add Admin"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleModalSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Admin Name"
            rules={[{ required: true, message: "Please enter the Admin name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phonenumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter the phone number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="User Name"
            rules={[{ required: true, message: "Please enter the Username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter the Password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "end" }}>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingAdmin ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminManagement;
