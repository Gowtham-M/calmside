import React, { useState, useEffect } from "react";
import { Tabs, Input, Button, Table } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UserOrderPage.css";

const { TabPane } = Tabs;

const UserOrderPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const { company } = useParams();

  useEffect(() => {
    axios.get(`/api/menu/${company}`).then((response) => {
      setMenuItems(response.data);
    });
  }, [company]);

  const handleAddItem = (item, quantity) => {
    const updatedItems = [...selectedItems];
    const existingItem = updatedItems.find((i) => i._id === item._id);
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      updatedItems.push({ ...item, quantity });
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

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="One Time Order" key="1">
          <Table
            dataSource={menuItems}
            columns={[
              { title: "Item", dataIndex: "name" },
              { title: "Price", dataIndex: "price" },
              {
                title: "Quantity",
                render: (text, record) => (
                  <Input
                    onChange={(e) => handleAddItem(record, e.target.value)}
                  />
                ),
              },
            ]}
          />
          <Button type="primary" onClick={handlePayment}>
            Place Order
          </Button>
        </TabPane>
        <TabPane tab="Subscriptions" key="2">
          <p>Subscription options here</p>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserOrderPage;
