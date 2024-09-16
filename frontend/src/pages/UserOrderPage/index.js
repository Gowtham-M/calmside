import React, { useState, useEffect } from "react";
import {
  Tabs,
  Button,
  Space,
  Spin,
  Modal,
  Carousel,
  Typography,
  Row,
  Col,
  Input,
  message,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./UserOrderPage.css";

const { Text } = Typography;

const UserOrderPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [phoneNumber, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const { company } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_API_URL}/api/menu/${company}`)
      .then((response) => {
        setCompanyName(response.data.companyName);
        setMenuItems(response.data.items);
      });
  }, [company]);

  const handleQuantityChange = (item, delta) => {
    const updatedItems = [...selectedItems];
    const existingItem = updatedItems.find((i) => i._id === item._id);
    if (existingItem) {
      existingItem.quantity = Math.max(0, existingItem.quantity + delta);
      if (delta < 0 && existingItem.quantity !== 0)
        message.error(`${item.itemName} removed from cart`);
      if (existingItem.quantity === 0) {
        const index = updatedItems.indexOf(existingItem);
        updatedItems.splice(index, 1);
      }
    } else {
      if (delta > 0) {
        updatedItems.push({ ...item, quantity: delta });
        message.success(`${item.itemName} added to cart`);
      }
    }

    setSelectedItems(updatedItems);
  };

  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    setPhone(inputPhone);

    // Simple phone number validation
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format: starts with 6-9 and is 10 digits long
    setIsPhoneValid(phoneRegex.test(inputPhone));
  };

  const handlePayment = () => {
    if (!isPhoneValid) {
      message.error("Please enter a valid phone number.");
      return;
    }
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/payment/create-order`,
        {
          items: selectedItems,
          company,
          amount: calculateTotal(),
          phoneNumber,
        }
      )
      .then((response) => {
        if (response.data.success) {
          const { order, key } = response.data;
          const options = {
            key: key, // Your Razorpay Key
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: companyName || "Company Name",
            description: "Test Transaction",
            order_id: order.id,
            handler: function (response) {
              // Handle success here
              console.log("Payment Success:", response);
              //  send the payment details to your server
              axios
                .post(
                  `${process.env.REACT_APP_BACKEND_API_URL}/api/payment/success`,
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }
                )
                .then(() => {
                  // Reset form after successful payment
                  setSelectedItems([]);
                  setPhone("");
                  setIsPhoneValid(false);
                  message.success(
                    "Payment successful. Your order has been placed."
                  );
                })
                .catch((error) => {
                  console.error("Failed to update payment status:", error);
                  message.error("Failed to confirm payment.");
                });
            },
            prefill: {
              name: "", // User's name
              email: "", // User's email
              contact: phoneNumber, // User's phone number
            },
            theme: {
              color: "#F37254",
            },
            modal: {
              ondismiss: function () {
                console.log("Payment modal closed by the user.");
                // Handle payment failure or user cancellation
                axios
                  .post(
                    `${process.env.REACT_APP_BACKEND_API_URL}/api/payment/failed`,
                    {
                      razorpay_order_id: order.id,
                    }
                  )
                  .then(() => {
                    message.error("Payment failed or canceled.");
                  })
                  .catch((error) => {
                    console.error("Failed to update payment status:", error);
                  });
              },
            },
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        } else {
          message.error("Failed to create order.");
        }
      })
      .catch((error) => {
        console.error("Payment error:", error);
        message.error("An error occurred while processing the payment.");
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

  const handleCategoryClick = (categoryItems) => {
    setSelectedCategoryItems(categoryItems);
    setIsCategoryModalVisible(true);
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const renderOrderSummary = () => {
    return selectedItems?.map((item) => (
      <div key={item._id} style={{ marginBottom: "8px" }}>
        <Text>
          {item.itemName} × {item.quantity} × {item.price} ={" "}
          {item.quantity * item.price}
        </Text>
      </div>
    ));
  };

  // Veg/Non-Veg indicator (green square border with green dot for veg, red for non-veg)
  const renderVegIndicator = (type) => (
    <div
      style={{
        display: "inline-block",
        width: "25px", // Adjusted width to ensure visibility of padding
        height: "25px", // Adjusted height to ensure visibility of padding
        borderRadius: "5px", // Slightly rounded corners for better appearance
        border: `2px solid ${type === "veg" ? "green" : "red"}`, // Border color
        position: "relative",
        padding: "5px", // Padding to create space between circle and border
        marginRight: "5px",
      }}
    >
      <div
        style={{
          backgroundColor: type === "veg" ? "green" : "red",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );

  return (
    <div>
      <Tabs defaultActiveKey="1" style={{ margin: "5px" }}>
        <Tabs.TabPane tab="One Time Order" key="1">
          <Row gutter={[16, 16]} justify="start">
            {Object.keys(groupedItems).length > 0 ? (
              Object.keys(groupedItems).map((category) => (
                <Col key={category} xs={24} sm={12} md={8} lg={6}>
                  <div
                    className="category-card"
                    onClick={() => handleCategoryClick(groupedItems[category])}
                  >
                    <img
                      src={`${process.env.REACT_APP_BACKEND_API_URL}${groupedItems[category][0].imageUrl[0]}`}
                      alt={groupedItems[category].itemName}
                      style={{ width: "100%" }}
                      className="menu-item-image"
                    />
                    <h3>{category}</h3>
                    <Button type="primary">View Items</Button>
                  </div>
                </Col>
              ))
            ) : (
              <Typography
                style={{ margin: "auto", color: "Green", fontSize: "32px" }}
              >
                We are preparing our Menu! Please visit again!
              </Typography>
            )}
          </Row>

          {selectedItems.length > 0 && (
            <div style={{ marginTop: "16px", marginLeft: "25px" }}>
              <h3>Order Summary</h3>
              {renderOrderSummary()}
              <Text strong>Total Price: {calculateTotal()}</Text>
              <div style={{ marginTop: "16px" }}>
                <Input
                  placeholder="Enter Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  style={{ width: "200px" }}
                />
                {!isPhoneValid && phoneNumber && (
                  <Text type="danger" style={{ marginLeft: "8px" }}>
                    Invalid phone number
                  </Text>
                )}
              </div>
              <Button
                type="primary"
                onClick={handlePayment}
                style={{ margin: "25px 0 0 25px" }}
              >
                Proceed to Payment
              </Button>
            </div>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Subscriptions" key="2">
          <div style={{ marginTop: "16px", marginLeft: "25px" }}>
            <h3>Subscription Options</h3>
            {/* Add subscription-related content here */}
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="Category Items"
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        footer={null}
        width={800}
      >
        <div className="modal-container">
          <div className="modal-left">
            <Carousel
              autoplay
              arrows
              prevArrow={<CaretLeftOutlined style={{ color: "#000" }} />}
              nextArrow={<CaretRightOutlined style={{ color: "#000" }} />}
            >
              {selectedCategoryItems.length > 0 ? (
                selectedCategoryItems.map((item) => (
                  <div key={item._id} style={{ padding: "10px" }}>
                    <img
                      className="menu-item-image"
                      key={item._id}
                      src={`${process.env.REACT_APP_BACKEND_API_URL}${item.imageUrl[0]}`}
                      alt={item.itemName}
                      style={{ width: "100%", height: "50vh" }}
                    />
                    <h2>{item.category}</h2>
                    <h3>
                      {" "}
                      {renderVegIndicator(item.type)}
                      {item.itemName}
                    </h3>
                    <p>Price: {item.price}</p>
                    <Space>
                      <Button
                        icon={<MinusOutlined />}
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={
                          selectedItems.find((i) => i._id === item._id)
                            ?.quantity <= 0
                        }
                      />
                      <span
                        style={{
                          display: "inline-block",
                          width: "40px",
                          textAlign: "center",
                        }}
                      >
                        {selectedItems.find((i) => i._id === item._id)
                          ?.quantity || 0}
                      </span>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => handleQuantityChange(item, 1)}
                      />
                    </Space>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <Spin size="large" />
                  <p>Loading items...</p>
                </div>
              )}
            </Carousel>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserOrderPage;
