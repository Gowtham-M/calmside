import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message } from "antd";
import axios from "axios";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";

const DigitalLedger = () => {
  const [ledger, setLedger] = useState([]);
  const [form] = Form.useForm();
  const { company } = useParams();

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async (filters = {}) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/ledger`,
        { params: { companyId: company, ...filters } }
      );
      setLedger(data);
    } catch (error) {
      message.error("Failed to fetch ledger");
    }
  };

  const handleFilters = async (values) => {
    const filters = {
      phoneNumber: values.phoneNumber,
      startDate: values.date ? values.date[0].toISOString() : undefined,
      endDate: values.date ? values.date[1].toISOString() : undefined,
    };
    fetchLedger(filters);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(ledger);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger");
    XLSX.writeFile(wb, "ledger.xlsx");
  };

  const exportToPdf = () => {
    // Implement PDF export functionality
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Digital Ledger</h2>
      <Form form={form} onFinish={handleFilters} layout="inline">
        <Form.Item name="phoneNumber" label="Phone Number">
          <Input />
        </Form.Item>
        <Form.Item name="date" label="Date Range">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Filter
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={exportToExcel} style={{ margin: "10px 0" }}>
        Export to Excel
      </Button>
      <Button onClick={exportToPdf} style={{ margin: "10px 0" }}>
        Export to PDF
      </Button>
      <Table dataSource={ledger} rowKey="_id" />
    </div>
  );
};

export default DigitalLedger;
