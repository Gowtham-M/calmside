import React, { useEffect, useState } from 'react';
import { Tabs, Table, InputNumber, Button, Input, Collapse } from 'antd';
import axios from 'axios';
import './UserOrderPage.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const UserOrderPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');

  const company = window.location.pathname.split('/')[1]; // Extract company from URL path

  useEffect(() => {
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
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handlePlaceOrder = () => {
    if (!phoneNumber) {
      alert('Phone number is required!');
      return;
    }
    axios.post('/api/order', {
      items: selectedItems,
      phoneNumber,
      totalPrice
    }).then((response) => {
      window.location.href = response.data.paymentUrl;
    });
  };

  const renderMenuTable = () => {
    if (Array.isArray(menuItems)) {
      const columns = [
        { title: 'Item Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        {
          title: 'Quantity',
          key: 'quantity',
          render: (_, record) => (
            <InputNumber
              min={0}
              defaultValue={0}
              onChange={(value) => addToOrder(record, value)}
            />
          ),
        },
      ];
      return <Table dataSource={menuItems} columns={columns} rowKey="_id" />;
    } else {
      return Object.keys(menuItems).map((category) => (
        <Collapse key={category} defaultActiveKey={category}>
          <Panel header={category} key={category}>
            <Table
              dataSource={Object.keys(menuItems[category]).map(item => ({
                name: item,
                price: menuItems[category][item],
                _id: item
              }))}
              columns={[
                { title: 'Item Name', dataIndex: 'name', key: 'name' },
                { title: 'Price', dataIndex: 'price', key: 'price' },
                {
                  title: 'Quantity',
                  key: 'quantity',
                  render: (_, record) => (
                    <InputNumber
                      min={0}
                      defaultValue={0}
                      onChange={(value) => addToOrder(record, value)}
                    />
                  ),
                },
              ]}
              rowKey="_id"
            />
          </Panel>
        </Collapse>
      ));
    }
  };

  return (
    <div className="user-order-page">
      <Tabs defaultActiveKey="1">
        <TabPane tab="One-time Orders" key="1">
          {renderMenuTable()}

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

          <Button type="primary" onClick={handlePlaceOrder} disabled={!phoneNumber}>
            Place Order
          </Button>
        </TabPane>

        <TabPane tab="Subscriptions" key="2">
          <h3>Subscription Plans</h3>
          {/* Add subscription UI here */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserOrderPage;
