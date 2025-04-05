// components/dashboard/investor/InvestmentChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 30000 },
  { name: 'Feb', value: 50000 },
  { name: 'Mar', value: 40000 },
];

const InvestmentChart = () => (
  <div className="p-4 bg-white rounded-xl shadow mt-4">
    <h3 className="text-lg font-semibold mb-2">Investment Trends</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default InvestmentChart;
