// components/dashboard/startup/StartupDashboard.jsx
import React, { useState } from 'react';
import DashboardHeader from '../common/DashboardHeader';
import CreateProposalForm from './CreateProposalForm';
import ProposalOverviewWithProgress from './ProposalOverviewWithProgress';

const tabs = [
  { name: 'Create Proposal', key: 'create' },
  { name: 'My Proposals', key: 'proposals' },
];

const FounderDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="p-4">
      <DashboardHeader title="Founder Dashboard" />
      
      <div className="flex gap-4 mt-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'create' && <CreateProposalForm />}
        {activeTab === 'proposals' && <ProposalOverviewWithProgress />}
      </div>
    </div>
  );
};

export default FounderDashboard;
