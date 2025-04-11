import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminHome from './AdminHome';
import InvestorHome from './InvestorHome';
import FounderHome from './FounderHome';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-neutral-900">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Welcome, {user.name?.split(' ')[0] || "User"} 👋
        </h1>
        <Link
          to="/logout"
          className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </Link>
      </div>

      {/* Role-based dashboard */}
      <div>
        {user.role === 'admin' && <AdminHome />}
        {user.role === 'investor' && <InvestorHome />}
        {user.role === 'founder' && <FounderHome />}
      </div>
    </div>
  );
};

export default DashboardPage;
