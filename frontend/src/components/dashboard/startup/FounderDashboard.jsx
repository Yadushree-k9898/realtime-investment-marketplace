import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardHeader from '../common/DashboardHeader';
import ProposalOverviewWithProgress from './ProposalOverviewWithProgress';
import CreateProposalForm from '@/components/proposals/CreateProposalForm';
import { fetchProposals } from '@/redux/slices/proposalSlice';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

const FounderDashboard = () => {
  const dispatch = useDispatch();
  const { fetched } = useSelector((state) => state.proposals);
  const { user } = useSelector((state) => state.auth);
  const [tab, setTab] = useState('proposals');

  useEffect(() => {
    if (user && !fetched) {
      dispatch(fetchProposals());
    }
  }, [dispatch, user, fetched]);

  return (
    <div className="p-4">
      <DashboardHeader title="Founder Dashboard" />

      <Tabs defaultValue="proposals" value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="proposals" className="flex-1">My Proposals</TabsTrigger>
          <TabsTrigger value="create" className="flex-1">Create Proposal</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals">
          <ProposalOverviewWithProgress />
        </TabsContent>

        <TabsContent value="create">
          <CreateProposalForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FounderDashboard;
