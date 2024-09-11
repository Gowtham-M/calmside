import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage/index";
import UserOrderPage from "./pages/UserOrderPage/index";
import AdminPage from "./pages/AdminPage/index";
import LoginPage from "./pages/LoginPage";
import CompanyManagement from "./pages/SuperUserPage/index";
import AdminManagement from "./pages/SuperUserPage/addAdmin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/su" element={<CompanyManagement />} />
        <Route path="/company/:company" element={<AdminManagement />} />
        <Route path="/:company" element={<UserOrderPage />} />
        <Route path="/admin/:company" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
