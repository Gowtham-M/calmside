import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage/index';
import UserOrderPage from './pages/UserOrderPage/index';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:company" element={<UserOrderPage />} />
        <Route path="/admin/:company" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
