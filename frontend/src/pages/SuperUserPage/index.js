import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SuperUserPage.css";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // State to store the uploaded file
  const [form] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/companies`
      );
      setCompanies(data);
    } catch (error) {
      message.error("Failed to fetch companies");
    }
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsModalVisible(true);
  };

  const handleEditCompany = (record) => {
    setEditingCompany(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/companies/${companyId}`,
        { isActive: false }
      );
      message.success("Company deactivated");
      fetchCompanies();
    } catch (error) {
      message.error("Failed to deactivate company");
    }
  };

  const handleActivateCompany = async (companyId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/companies/${companyId}`,
        { isActive: true }
      );
      message.success("Company activated");
      fetchCompanies();
    } catch (error) {
      message.error("Failed to activate company");
    }
  };

  const handleModalSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("companyName", values.companyName);
      formData.append("branchName", values.branchName);
      formData.append("address", values.address);
      formData.append("upiId", values.upiId);

      // Append logo file if present
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (editingCompany) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/companies/${editingCompany._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Company updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/companies`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        message.success("Company added successfully");
      }
      fetchCompanies();
      setIsModalVisible(false);
      form.resetFields();
      setLogoFile(null); // Reset logo file
    } catch (error) {
      message.error("Failed to save company details");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (file) => {
    setLogoFile(file); // Store the selected file in the state
    return false; // Prevent auto-upload
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
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      align: "left",
      render: (text, record) => (
        <Button
          type="link"
          style={{ display: "contents" }}
          onClick={() => handleViewCompanyDetails(record)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
      align: "left",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "left",
    },
    {
      title: "UPI ID",
      dataIndex: "upiId",
      key: "upiId",
      align: "left",
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      align: "left",
      render: (text) => (
        <img
          src={`${process.env.REACT_APP_BACKEND_API_URL}${text}`}
          alt="Company Logo"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "left",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditCompany(record)}
          />
          {record.isActive ? (
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteCompany(record._id)}
            />
          ) : (
            <Button
              type="primary"
              onClick={() => handleActivateCompany(record._id)}
            >
              Activate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleViewCompanyDetails = (record) => {
    navigate(`/company/${record._id}`);
  };

  return (
    <div className="company-management-container">
      <div className="header-container">
        <h2>Company Management</h2>
        <Button type="primary" onClick={handleAddCompany}>
          Add Company
        </Button>
      </div>

      <h3>Active Companies</h3>
      <Table
        columns={columns}
        dataSource={companies.filter((company) => company.isActive)}
        rowKey="_id"
      />

      <h3>Inactive Companies</h3>
      <Table
        columns={columns}
        dataSource={companies.filter((company) => !company.isActive)}
        rowKey="_id"
      />

      <Modal
        title={editingCompany ? "Edit Company" : "Add Company"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleModalSubmit} layout="vertical">
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[
              { required: true, message: "Please enter the company name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="branchName"
            label="Branch Name"
            rules={[
              { required: true, message: "Please enter the branch name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter the address" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="upiId"
            label="UPI ID"
            rules={[{ required: true, message: "Please enter the UPI ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Logo" valuePropName="file">
            <Upload
              beforeUpload={handleLogoUpload}
              accept="image/*"
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "end" }}>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCompany ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CompanyManagement;
