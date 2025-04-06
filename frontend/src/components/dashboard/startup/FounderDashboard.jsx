// components/dashboard/startup/StartupDashboard.jsx
import React from 'react';
import DashboardHeader from '../common/DashboardHeader';
import ProposalOverview from './ProposalOverview';
import FundingProgress from './FundingProgress';
import CreateProposalForm from './CreateProposalForm';

const FounderDashboard = () => {
  return (
    <div>
      <DashboardHeader title="Founder Dashboard" />
      <CreateProposalForm />
      <ProposalOverview />
      <FundingProgress />
    </div>
  );
};

export default FounderDashboard;
