// // components/dashboard/common/DashboardHeader.jsx
// import React from 'react';

// const DashboardHeader = ({ title }) => (
//   <div className="mb-6">
//     <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h2>
//   </div>
// );

// export default DashboardHeader;

import React from 'react';

const DashboardHeader = ({ title }) => (
  <div className="mb-6 border-b border-gray-200 dark:border-neutral-700 pb-3">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
      {title}
    </h2>
  </div>
);

export default DashboardHeader;
