import React, { useEffect, useState } from 'react';

import { fetchInvestorStats } from '@/services/dashboardService';


const InvestmentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchInvestorStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch investment stats", err);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <p className="text-sm text-gray-500">Loading investment stats...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold">Total Investments</h3>
      <p className="text-2xl font-bold">₹ {stats?.totalInvestment?.toLocaleString() || 0}</p>
      <p className="text-sm text-gray-500">Active Investments: {stats?.activeDeals || 0}</p>
    </div>
  );
};

export default InvestmentStats;
