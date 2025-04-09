import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardHeader from '../common/DashboardHeader';
import ProposalOverviewWithProgress from './ProposalOverviewWithProgress';
import { fetchProposals } from '@/redux/slices/proposalSlice';
import { Button } from '@/components/ui/button';
import CreateProposalForm from './CreateProposalForm';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const FounderDashboard = () => {
  const dispatch = useDispatch();
  const { fetched } = useSelector((state) => state.proposals);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Button onClick={() => setIsModalOpen(true)}>+ New Proposal</Button>
      </div>

      <ProposalOverviewWithProgress />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white dark:bg-neutral-900 p-6 shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-bold">Create New Proposal</Dialog.Title>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
              </button>
            </div>
            <CreateProposalForm />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default FounderDashboard;
