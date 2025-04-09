import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardHeader from '../common/DashboardHeader';
import ProposalOverviewWithProgress from './ProposalOverviewWithProgress';
import { fetchProposals } from '@/redux/slices/proposalSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FounderDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetched } = useSelector((state) => state.proposals);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && !fetched) {
      dispatch(fetchProposals());
    }
  }, [dispatch, user, fetched]);

  return (
    <div className="p-4">
      <DashboardHeader title="Founder Dashboard" />

      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-xl font-semibold">My Proposals</h2>
        <Button onClick={() => navigate("/proposals/create")}>+ New Proposal</Button>
      </div>

      <ProposalOverviewWithProgress />
    </div>
  );
};

export default FounderDashboard;
