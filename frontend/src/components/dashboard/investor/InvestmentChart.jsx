import React, { useEffect, useState } from 'react';
import { fetchFundingTrends } from '@/services/dashboardService';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const InvestmentChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChartData = async () => {
      try {
        const data = await fetchFundingTrends();
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      } finally {
        setLoading(false);
      }
    };
    getChartData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-xl shadow mt-4">
        <p className="text-sm text-gray-500">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-4">
      <h3 className="text-lg font-semibold mb-2">Investment Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentChart;
