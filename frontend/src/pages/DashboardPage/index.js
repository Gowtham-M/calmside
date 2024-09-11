import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch companies list from the backend API
    axios.get("/api/companies").then((response) => {
      setCompanies(response.data);
    });
  }, []);

  const handleCompanyClick = (company) => {
    navigate(`/${company}`);
  };

  return (
    <div className="dashboard-page">
      <h2>Select a Company</h2>
      <Row gutter={16}>
        {companies.map((company) => (
          <Col span={8} key={company}>
            <Card
              title={company}
              hoverable
              onClick={() => handleCompanyClick(company)}
            >
              {company} Menu
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardPage;
