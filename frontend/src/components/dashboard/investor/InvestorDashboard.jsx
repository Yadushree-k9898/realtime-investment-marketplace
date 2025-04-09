// components/dashboard/investor/InvestorDashboard.jsx
import React from 'react';
import DashboardHeader from '../common/DashboardHeader';
import InvestmentStats from './InvestmentStats';
// import ProposalReviewList from './ProposalReviewList';
import InvestmentChart from './InvestmentChart';

const InvestorDashboard = () => {
  return (
    <div>
      <DashboardHeader title="Investor Dashboard" />
      <InvestmentStats />
      <InvestmentChart />
      {/* <ProposalReviewList /> */}
    </div>
  );
};

export default InvestorDashboard;