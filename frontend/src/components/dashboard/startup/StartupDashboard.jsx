// components/dashboard/startup/StartupDashboard.jsx
import React from 'react';
import DashboardHeader from '../common/DashboardHeader';
import ProposalOverview from './ProposalOverview';
import FundingProgress from './FundingProgress';
import CreateProposalForm from './CreateProposalForm';

const StartupDashboard = () => {
  return (
    <div>
      <DashboardHeader title="Startup Dashboard" />
      <CreateProposalForm />
      <ProposalOverview />
      <FundingProgress />
    </div>
  );
};

export default StartupDashboard;
