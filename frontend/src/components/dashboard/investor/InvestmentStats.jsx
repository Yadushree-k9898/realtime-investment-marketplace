import React, { useEffect, useState } from 'react';
import investmentService from '@/services/investmentService'; // ✅ Import the default object

const InvestmentStats = () => {
  const [stats, setStats] = useState({
    totalInvestment: 0,
    activeDeals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await investmentService.fetchInvestorStats(); // ✅ use method from object
        console.log('Stats data:', data);
        setStats({
          totalInvestment: data.totalInvested || 0,
          activeDeals: data.investmentCount || 0
        });
      } catch (err) {
        console.error("Failed to fetch investment stats", err);
        setError(err.message);
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

  if (error) {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold">Total Investments</h3>
      <p className="text-2xl font-bold">₹ {stats.totalInvestment.toLocaleString()}</p>
      <p className="text-sm text-gray-500">Active Investments: {stats.activeDeals}</p>
    </div>
  );
};

export default InvestmentStats;
