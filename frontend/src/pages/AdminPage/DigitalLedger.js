import React, { useState, useEffect } from "react";
import { Button, DatePicker, Form, Input, Table, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import "./DigitalLedger.css";

const { RangePicker } = DatePicker;

const DigitalLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const { company } = useParams();
  const [form] = Form.useForm(); // Initialize the form instance

  useEffect(() => {
    fetchLedgerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchLedgerData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        companyId: company,
        phoneNumber: filters.phoneNumber || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
      }).toString();

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/ledger?${queryParams}`
      );
      setLedgerData(data);
    } catch (error) {
      message.error("Failed to fetch ledger data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (values) => {
    const [startDate, endDate] = values.dateRange || [];
    const phoneNumber = values.phoneNumber || "";

    const newFilters = {
      startDate: startDate
        ? dayjs(startDate).startOf("day").format("YYYY-MM-DD")
        : null,
      endDate: endDate
        ? dayjs(endDate).startOf("day").format("YYYY-MM-DD")
        : null,
      phoneNumber: phoneNumber,
    };
    setFilters(newFilters);
  };

  const handleLedgerDownload = async (format) => {
    try {
      const queryParams = new URLSearchParams({
        companyId: company,
        phoneNumber: filters.phoneNumber || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        format: format, // excel or pdf
      }).toString();

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/ledger/download?${queryParams}`,
        {
          responseType: "blob", // important for handling binary data
        }
      );

      const blob = new Blob([response.data], {
        type:
          format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `ledger.${format === "excel" ? "xlsx" : "pdf"}`;
      link.click();
    } catch (error) {
      message.error("Failed to download ledger");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Customer Phone",
      dataIndex: "userPhoneNumber",
      key: "userPhoneNumber",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Order Details",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (items) =>
        items.map((item) => (
          <div key={item._id}>
            {item.itemName} x {item.quantity} = {item.price * item.quantity}
          </div>
        )),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
  ];

  // Disable future dates
  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  // Phone number validation rule
  const phoneNumberValidator = (_, value) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (value && !phoneRegex.test(value)) {
      return Promise.reject("Invalid phone number.");
    }
    return Promise.resolve();
  };

  return (
    <div className="ledger-container">
      <h3 className="ledger-heading">Digital Ledger</h3>
      <Form
        form={form}
        onFinish={handleFilterSubmit}
        layout="inline"
        style={{ marginBottom: 20 }}
      >
        <Form.Item name="dateRange" label="Date Range">
          <RangePicker disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            {
              validator: phoneNumberValidator,
            },
          ]}
        >
          <Input
            placeholder="Filter by phone number"
            style={{ width: "20vw" }}
            onChange={(e) => form.validateFields(["phoneNumber"])} // Trigger validation on change
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Apply Filters
          </Button>
        </Form.Item>
      </Form>

      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={() => handleLedgerDownload("pdf")}
          type="primary"
          style={{ marginRight: 10 }}
        >
          Download PDF
        </Button>
        <Button onClick={() => handleLedgerDownload("excel")} type="primary">
          Download Excel
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={ledgerData}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DigitalLedgerPage;
