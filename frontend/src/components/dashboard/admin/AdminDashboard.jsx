


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../common/DashboardHeader';
import UserManagement from './UserManagement';
import PlatformStats from './PlatformStats';
import AnalyticsChart from './AnalyticsChart'; // Assuming this is your analytics component

const AdminDashboard = () => {
  const [viewingUsers, setViewingUsers] = useState(false);
  const [viewingAnalytics, setViewingAnalytics] = useState(false);

  return (
    <div>
      <DashboardHeader title="Admin Dashboard" />

      {/* User Management View */}
      {viewingUsers && (
        <>
          <button
            onClick={() => setViewingUsers(false)}
            className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ← Back to Dashboard
          </button>
          <UserManagement />
        </>
      )}

      {/* Analytics View */}
      {viewingAnalytics && (
        <>
          <button
            onClick={() => setViewingAnalytics(false)}
            className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ← Back to Dashboard
          </button>
          <AnalyticsChart />
        </>
      )}

      {/* Main Dashboard */}
      {!viewingUsers && !viewingAnalytics && (
        <>
          {/* Dashboard Stats and Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <PlatformStats />

            {/* View Investments */}
            <Link
              to="/admin/investments"
              className="p-4 rounded-xl shadow bg-white dark:bg-neutral-800 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                View Investments
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                See all platform investments
              </p>
            </Link>

            {/* View Users */}
            <div
              onClick={() => setViewingUsers(true)}
              className="p-4 rounded-xl shadow bg-white dark:bg-neutral-800 hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                View Users
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Manage all registered users
              </p>
            </div>

            {/* View Analytics */}
            <div
              onClick={() => setViewingAnalytics(true)}
              className="p-4 rounded-xl shadow bg-white dark:bg-neutral-800 hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                View Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Visualize funding trends, ROI, and user activity
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
