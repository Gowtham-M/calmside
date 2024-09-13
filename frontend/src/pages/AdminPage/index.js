import React from "react";
import { Layout, Menu } from "antd";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import {
  BarChartOutlined,
  FileExcelOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import EditMenu from "./EditMenu";
import SalesAnalytics from "./SalesAnalytics";
import DigitalLedger from "./DigitalLedger";

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider for Navigation */}
      <Sider width={200} theme="dark">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="/admin/edit-menu" icon={<UnorderedListOutlined />}>
            <Link to="/admin/edit-menu">Edit Menu</Link>
          </Menu.Item>
          <Menu.Item key="/admin/sales-analytics" icon={<BarChartOutlined />}>
            <Link to="/admin/sales-analytics">View Sales Analytics</Link>
          </Menu.Item>
          <Menu.Item key="/admin/digital-ledger" icon={<FileExcelOutlined />}>
            <Link to="/admin/digital-ledger">Download Digital Ledger</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content Area */}
      <Layout>
        <Header style={{ backgroundColor: "#fff", padding: 0 }} />
        <Content style={{ padding: "24px", margin: 0, minHeight: 280 }}>
          <Routes>
            <Route path="/admin/edit-menu" element={<EditMenu />} />
            <Route path="/admin/sales-analytics" element={<SalesAnalytics />} />
            <Route path="/admin/digital-ledger" element={<DigitalLedger />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
