import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  AppstoreOutlined,
  BarChartOutlined,
  FileOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const AdminSideNav = () => {
  const { company } = useParams();
  const location = useLocation();

  // Determine the selected key based on the current path
  const getSelectedKey = () => {
    if (location.pathname.includes("/menu-management")) return "1";
    if (location.pathname.includes("/sales-analytics")) return "2";
    if (location.pathname.includes("/digital-ledger")) return "3";
    return "1"; // Default key
  };

  const menuItems = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: (
        <Link to={`/admin/${company}/menu-management`}>Menu Management</Link>
      ),
    },
    {
      key: "2",
      icon: <BarChartOutlined />,
      label: (
        <Link to={`/admin/${company}/sales-analytics`}>Sales Analytics</Link>
      ),
    },
    {
      key: "3",
      icon: <FileOutlined />,
      label: (
        <Link to={`/admin/${company}/digital-ledger`}>Digital Ledger</Link>
      ),
    },
  ];

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]} // Dynamically set the active tab
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems} // Use the items property
      />
    </Sider>
  );
};

export default AdminSideNav;
