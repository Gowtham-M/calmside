import React, { useState, useEffect } from "react";
import { Tabs, Button, Table, Space, Collapse, Typography } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UserOrderPage.css";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Text } = Typography;

const UserOrderPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const { company } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_API_URL}/api/menu/${company}`)
      .then((response) => {
        setMenuItems(response.data);
      });
  }, [company]);

  const handleQuantityChange = (item, delta) => {
    const updatedItems = [...selectedItems];
    const existingItem = updatedItems.find((i) => i._id === item._id);
    if (existingItem) {
      existingItem.quantity = Math.max(0, existingItem.quantity + delta);
      if (existingItem.quantity === 0) {
        const index = updatedItems.indexOf(existingItem);
        updatedItems.splice(index, 1);
      }
    } else {
      if (delta > 0) {
        updatedItems.push({ ...item, quantity: delta });
      }
    }
    setSelectedItems(updatedItems);
  };

  const handlePayment = () => {
    axios
      .post("/api/payment", {
        items: selectedItems,
        company,
        total: selectedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        phone: "",
      })
      .then((response) => {
        window.location.href = response.data.paymentUrl;
      });
  };

  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const { category } = item;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const columns = [
    { title: "Item", dataIndex: "itemName" },
    { title: "Price", dataIndex: "price", align: "right" },
    {
      title: "Quantity",
      render: (text, record) => (
        <Space>
          <Button
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(record, -1)}
            disabled={
              selectedItems.find((i) => i._id === record._id)?.quantity <= 0
            }
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              padding: 0,
            }}
          />
          <span
            style={{
              display: "inline-block",
              width: "40px",
              textAlign: "center",
            }}
          >
            {selectedItems.find((i) => i._id === record._id)?.quantity || 0}
          </span>
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record, 1)}
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              padding: 0,
            }}
          />
        </Space>
      ),
      align: "center",
    },
  ];

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const renderOrderSummary = () => {
    return selectedItems.map((item) => (
      <div key={item._id} style={{ marginBottom: "8px" }}>
        <Text>
          {item.itemName} × {item.quantity} × {item.price} ={" "}
          {item.quantity * item.price}
        </Text>
      </div>
    ));
  };

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="One Time Order" key="1">
          <Collapse defaultActiveKey={Object.keys(groupedItems)}>
            {Object.keys(groupedItems).map((category) => (
              <Panel header={category} key={category}>
                <Table
                  dataSource={groupedItems[category]}
                  columns={columns}
                  rowKey="_id"
                  pagination={false}
                  size="middle"
                />
              </Panel>
            ))}
          </Collapse>
          {selectedItems.length > 0 && (
            <div style={{ marginTop: "16px", marginLeft: "25px" }}>
              <h3>Order Summary</h3>
              {renderOrderSummary()}
              <Text strong>Total Price: {calculateTotal()}</Text>
              <Button
                type="primary"
                onClick={handlePayment}
                style={{ margin: "25px 0 0 25px" }}
              >
                Place Order
              </Button>
            </div>
          )}
        </TabPane>
        <TabPane tab="Subscriptions" key="2" style={{ textAlign: "center" }}>
          <p>Subscription options here</p>
          <h2 style={{ color: "green" }}>Thank you for visiting our page!</h2>
          <h3>We are setting things up here!</h3>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserOrderPage;
