import React, { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const SalesAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const { company } = useParams();

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]); // Added company as a dependency

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/analytics/${company}`
      );
      setAnalytics(data);
    } catch (error) {
      message.error("Failed to fetch Analytics");
    }
  };

  const renderAnalytics = () => {
    if (!analytics) return <p>Loading analytics...</p>;
    return (
      <div>
        <h3>Sales Analytics</h3>
        <p>Total Sales: {analytics.totalSales}</p>
        <p>Total Orders: {analytics.totalOrders}</p>
        <p>Top Categories: {analytics.topCategories.join(", ")}</p>
      </div>
    );
  };

  return <div>{renderAnalytics()}</div>;
};

export default SalesAnalyticsPage;
