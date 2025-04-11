// pages/Admin/InvestmentsPage.jsx
import React from 'react';
import Investments from '@/components/dashboard/admin/Investments';

const InvestmentsPage = () => {
  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-neutral-900">
      <Investments />
    </div>
  );
};

export default InvestmentsPage;
