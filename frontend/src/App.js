// src/App.js
import React from 'react';
import Stock from './stock';
import './App.css';

const Dashboard = () => {
  return (
      <div className="dashboard">
          <h1>Stock Dashboard</h1>
          <Stock ticker="IBM" />
          <Stock ticker="AMZN" />
          <Stock ticker="DOW" />
          <Stock ticker="NASDAQ" />
      </div>
  );
};

export default Dashboard;