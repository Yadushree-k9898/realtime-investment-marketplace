// src/pages/Dashboard/DashboardPage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminHome from './AdminHome';
import InvestorHome from './InvestorHome';
import FounderHome from './FounderHome';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>

      {/* Add a logout button that links to the /logout route */}
      <Link
        to="/logout"
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </Link>

      {/* Render the appropriate home page based on user role */}
      {user.role === 'admin' && <AdminHome />}
      {user.role === 'investor' && <InvestorHome />}
      {user.role === 'founder' && <FounderHome/>}
    </div>
  );
};

export default DashboardPage;
