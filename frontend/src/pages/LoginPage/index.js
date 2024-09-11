import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/users/login`,
        values
      );

      const { role, company } = data.user;

      if (role.toLowerCase() === "superuser") {
        navigate("/su");
      } else if (role.toLowerCase() === "admin") {
        navigate(`/admin/${company}`);
      } else {
        message.error("Invalid credentials");
      }
    } catch (error) {
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "300px", margin: "0 auto", paddingTop: "50px" }}>
      <h2>Login</h2>
      <Form name="login" onFinish={handleLogin} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
