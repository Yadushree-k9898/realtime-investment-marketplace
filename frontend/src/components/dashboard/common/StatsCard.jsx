// components/dashboard/common/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon, bg }) => {
  return (
    <div className={`p-4 rounded-xl shadow-md ${bg} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
