// components/dashboard/startup/StartupDashboard.jsx
import React from 'react';
import DashboardHeader from '../common/DashboardHeader';
import ProposalOverviewWithProgress from './ProposalOverviewWithProgress';
import CreateProposalForm from './CreateProposalForm';

const FounderDashboard = () => {
  return (
    <div>
      <DashboardHeader title="Founder Dashboard" />
      <CreateProposalForm />
      <ProposalOverviewWithProgress/>
    </div>
  );
};

export default FounderDashboard;
