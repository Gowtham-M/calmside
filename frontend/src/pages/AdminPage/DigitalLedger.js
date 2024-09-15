import React, { useState, useEffect } from "react";
import { Button, DatePicker, Form, Input, Table, message } from "antd";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";

const { RangePicker } = DatePicker;

const DigitalLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const { company } = useParams();

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
    const newFilters = {
      startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : null,
      endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : null,
      phoneNumber: values.phoneNumber || null,
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
      dataIndex: "orderID", // Make sure this matches the backend
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
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Order Details",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (items) =>
        items.map((item) => (
          <div key={item.name}>
            {item.name} x {item.quantity} = {item.price * item.quantity}
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

  return (
    <div>
      <h3>Digital Ledger</h3>
      <Form
        onFinish={handleFilterSubmit}
        layout="inline"
        style={{ marginBottom: 20 }}
      >
        <Form.Item name="dateRange" label="Date Range">
          <RangePicker />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone Number">
          <Input
            placeholder="Filter by phone number"
            style={{ width: "20vw" }}
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
