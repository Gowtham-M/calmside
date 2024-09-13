import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage/index";
import UserOrderPage from "./pages/UserOrderPage/index";
import LoginPage from "./pages/LoginPage";
import CompanyManagement from "./pages/SuperUserPage/index";
import AdminManagement from "./pages/SuperUserPage/addAdmin";
import AdminLayout from "./pages/AdminPage/AdminLayout";
import MenuManagementPage from "./pages/AdminPage/EditMenu";
import SalesAnalyticsPage from "./pages/AdminPage/SalesAnalytics";
import DigitalLedgerPage from "./pages/AdminPage/DigitalLedger";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/su" element={<CompanyManagement />} />
        <Route path="/company/:company" element={<AdminManagement />} />
        <Route path="/:company" element={<UserOrderPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Pages with Sidebar Layout */}
        <Route path="/admin/:company" element={<AdminLayout />}>
          <Route path="menu-management" element={<MenuManagementPage />} />
          <Route path="sales-analytics" element={<SalesAnalyticsPage />} />
          <Route path="digital-ledger" element={<DigitalLedgerPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
