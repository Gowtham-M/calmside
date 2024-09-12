import React, { useEffect, useState } from "react";
import { Tabs, Table, InputNumber, Button, Input } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const UserOrderPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { company } = useParams();

  useEffect(() => {
    // Fetch menu items from backend based on company
    axios.get(`/api/menu/${company}`).then((response) => {
      setMenuItems(response.data);
    });
  }, [company]);

  const addToOrder = (item, qty) => {
    const updatedItems = [...selectedItems];
    const index = updatedItems.findIndex((i) => i._id === item._id);
    if (index >= 0) {
      updatedItems[index].quantity += qty;
    } else {
      updatedItems.push({ ...item, quantity: qty });
    }
    setSelectedItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handlePlaceOrder = () => {
    if (!phoneNumber) {
      alert("Phone number is required!");
      return;
    }
    // Redirect to payment gateway (Razorpay) and save the order in DB after payment success
    axios
      .post("/api/order", {
        items: selectedItems,
        phoneNumber,
        totalPrice,
      })
      .then((response) => {
        window.location.href = response.data.paymentUrl;
      });
  };

  const columns = [
    { title: "Item Name", dataIndex: "name", key: "name", align: "left" },
    { title: "Price", dataIndex: "price", key: "price", align: "left" },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <InputNumber
          min={0}
          defaultValue={0}
          onChange={(value) => addToOrder(record, value)}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="One-time Orders" key="1">
          <Table dataSource={menuItems} columns={columns} rowKey="_id" />

          <h3>Order Summary</h3>
          {selectedItems.map((item) => (
            <p key={item._id}>
              {item.name} x {item.quantity} = {item.price * item.quantity}
            </p>
          ))}

          <h4>Total: {totalPrice}</h4>

          <Input
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <Button
            type="primary"
            onClick={handlePlaceOrder}
            disabled={!phoneNumber}
          >
            Place Order
          </Button>
        </TabPane>

        <TabPane tab="Subscriptions" key="2">
          <h3>Subscription plans</h3>
          {/* Add subscription UI here */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserOrderPage;

// import React, { useState } from 'react';
// import { CheckCircleOutlined,CheckSquareOutlined } from '@ant-design/icons';
// import { Button, Row, Col } from 'antd';

// const MenuPage = () => {

//   return (
//     <div>
//         <>
//         <div style={{position:'fixed',top:'20px',left:'20px'}}>
//         <Row gutter={16}>
//         <Col>
//           <Button type="primary" style={{width:'300px',height:'50px'}} icon={<CheckCircleOutlined />} >
//             One Time Order
//           </Button>
//         </Col>
//         <Col>
//           <Button type="primary" style={{width:'300px',height:'50px'}} icon={<CheckSquareOutlined />} >
//             Subscriptions
//           </Button>
//         </Col>
//       </Row>
//         </div>
//         </>
//     </div>
//   )
// }

// export default MenuPage
