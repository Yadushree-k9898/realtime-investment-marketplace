import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProposals } from '@/redux/slices/proposalSlice';
import DashboardHeader from '../common/DashboardHeader';
import InvestmentStats from './InvestmentStats';
import InvestmentChart from './InvestmentChart';
import ProposalCard from '@/components/proposals/ProposalCard';

const InvestorDashboard = () => {
  const dispatch = useDispatch();
  const { proposals, loading, error } = useSelector((state) => state.proposals);

  useEffect(() => {
    dispatch(fetchProposals());
  }, [dispatch]);

  return (
    <div className="p-6">
      <DashboardHeader title="Investor Dashboard" />
      <InvestmentStats />
      <InvestmentChart />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Available Proposals</h2>
      {loading && <p>Loading proposals...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard key={proposal._id} proposal={proposal} />
          ))
        ) : (
          <p>No proposals available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;
