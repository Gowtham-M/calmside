import React from "react";
import { Layout } from "antd";
import AdminSideNav from "./AdminSideNav";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout className="admin-layout">
      <AdminSideNav />
      <Layout className="admin-content-layout">
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
