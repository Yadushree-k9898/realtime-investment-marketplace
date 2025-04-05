// components/dashboard/common/DashboardHeader.jsx
import React from 'react';

const DashboardHeader = ({ title }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h2>
  </div>
);

export default DashboardHeader;