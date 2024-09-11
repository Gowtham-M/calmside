import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardPage.css"; // Import CSS for styling

const DashboardPage = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  // Fetch the list of companies when the component mounts
  useEffect(() => {
    axios
      .get("/api/companies")
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle the click on a company card
  const handleCompanyClick = (company) => {
    navigate(`/${company.name}`);
  };

  return (
    <div className="dashboard-container">
      <h2>Select a Company</h2>
      <Row gutter={[16, 16]} className="dashboard-row">
        {companies.map((company) => (
          <Col key={company._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              className="company-card"
              hoverable
              cover={
                <img
                  alt={company.name}
                  src={company.logo || "default-logo.jpg"}
                />
              }
              onClick={() => handleCompanyClick(company)}
            >
              <Card.Meta title={company.name} description={company.address} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardPage;
