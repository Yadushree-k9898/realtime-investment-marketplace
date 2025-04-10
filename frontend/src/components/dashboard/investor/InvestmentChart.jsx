import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import investmentService from '@/services/investmentService';

const InvestmentChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getChartData = async () => {
      try {
        const rawData = await investmentService.fetchFundingTrends();
        console.log('Fetched chart data:', rawData);

        // Transform backend format to recharts format
        if (
          rawData?.labels &&
          Array.isArray(rawData.datasets) &&
          rawData.datasets.length > 0 &&
          Array.isArray(rawData.datasets[0].data)
        ) {
          const transformed = rawData.labels.map((label, index) => ({
            month: label,
            amount: rawData.datasets[0].data[index], // total invested amount
          }));
          setChartData(transformed);
        } else {
          console.error('Invalid data format:', rawData);
          setError('Invalid data format.');
        }
      } catch (err) {
        console.error('Failed to fetch chart data', err);
        setError('Failed to fetch chart data.');
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

  if (error) {
    return (
      <div className="p-4 bg-white rounded-xl shadow mt-4">
        <p className="text-sm text-red-500">{error}</p>
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
