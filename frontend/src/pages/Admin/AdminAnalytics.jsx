import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformStats } from "@/redux/slices/adminSlice";
import AnalyticsChart from "@/components/dashboard/admin/AnalyticsChart";

const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPlatformStats());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Platform Analytics
      </h2>

      {loading && (
        <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && stats && (
        <>
          {stats.userStats?.length > 0 ? (
            <AnalyticsChart
              title="User Registrations Over Time"
              data={stats.userStats}
              dataKey="count"
              xKey="month"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No user registration data available.
            </p>
          )}

          {stats.proposalStats?.length > 0 ? (
            <AnalyticsChart
              title="Proposals Created Over Time"
              data={stats.proposalStats}
              dataKey="count"
              xKey="month"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No proposal data available.
            </p>
          )}

          {stats.investmentStats?.length > 0 ? (
            <AnalyticsChart
              title="Investments Over Time"
              data={stats.investmentStats}
              dataKey="count"
              xKey="month"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No investment data available.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
