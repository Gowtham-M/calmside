import React from "react";
import { Layout, Menu } from "antd";
import { Link, useParams } from "react-router-dom";
import {
  AppstoreOutlined,
  BarChartOutlined,
  FileOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const AdminSideNav = () => {
  const { company } = useParams();

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<AppstoreOutlined />}>
          <Link to={`/admin/${company}/menu-management`}>Menu Management</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<BarChartOutlined />}>
          <Link to={`/admin/${company}/sales-analytics`}>Sales Analytics</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<FileOutlined />}>
          <Link to={`/admin/${company}/digital-ledger`}>
            Download Digital Ledger
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSideNav;
