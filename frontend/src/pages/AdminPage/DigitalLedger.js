import React, { useState } from "react";
import { Button, DatePicker, Form, Input, message } from "antd";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";

const DigitalLedgerPage = () => {
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const { company } = useParams();

  const handleDownloadLedger = async (filters) => {
    setLedgerLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/ledger/download`,
        {
          ...filters,
          company,
        },
        {
          responseType: "blob", // Important for file download
        }
      );
      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `ledger_${filters.startDate}_${filters.endDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      message.success("Ledger downloaded successfully");
    } catch (error) {
      message.error("Failed to download ledger");
    } finally {
      setLedgerLoading(false);
    }
  };

  const handleLedgerDownload = (values) => {
    const filters = {
      startDate: moment(values.startDate).format("YYYY-MM-DD"),
      endDate: moment(values.endDate).format("YYYY-MM-DD"),
      phoneNumber: values.phoneNumber || null,
    };
    handleDownloadLedger(filters);
  };

  return (
    <div>
      <h3>Download Digital Ledger</h3>
      <Form onFinish={handleLedgerDownload} layout="vertical">
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: "Please select an end date" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone Number">
          <Input placeholder="Optional filter by phone number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={ledgerLoading}>
            Download
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DigitalLedgerPage;
