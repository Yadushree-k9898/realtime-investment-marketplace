// components/dashboard/admin/AdminDashboard.jsx
import React from 'react';
import DashboardHeader from '../common/DashboardHeader';
import UserManagement from './UserManagement';
import PlatformStats from './PlatformStats';

const AdminDashboard = () => {
  return (
    <div>
      <DashboardHeader title="Admin Dashboard" />
      <PlatformStats />
      <UserManagement />
    </div>
  );
};

export default AdminDashboard;